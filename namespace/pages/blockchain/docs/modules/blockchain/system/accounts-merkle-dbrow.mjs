/*
 * @project: TERA
 * @version: Development (beta)
 * @license: MIT (not for evil)
 * @copyright: Yuriy Ivanov (Vtools) 2017-2020 [progr76@gmail.com]
 * Web: https://terafoundation.org
 * Twitter: https://twitter.com/terafoundation
 * Telegram:  https://t.me/terafoundation
*/


"use strict";

//Actual calculation of the total hash via Merkle tree

import logs from '../../debug/index.mjs'
let debug = (id, ...args) => {
    let path = import.meta.url
    let from = path.search('/blockchain');
    let to = path.length;
    let url = path.substring(from,to);
    logs.assert(-1,url, id, args)
}
export default (global) => {
debug('[(self)a]', global.PROCESS_NAME)
    class MerkleDBRow extends global.CDBRow
    {
        constructor(FileName, Format, bReadOnly, ColNumName, DeltaNum, DataSize)
        {
            super(FileName, Format, bReadOnly, ColNumName, DeltaNum, DataSize)

            this.ChangeTree = new global.RBTree(function (a,b)
            {
                return a - b;
            })
            this.InitMerkleTree()
        }
        InitMerkleTree()
        {
            this.MerkleTree = undefined
            this.MerkleArr = []
            this.MerkleCalc = {}
            this.ChangeTree.clear()
        }
        AddToUpdate(Num)
        {
            var Find = this.ChangeTree.find(Num);
            if(Find === null)
            {
                this.ChangeTree.insert(Num)
            }
        }
        UpdateByChangeTree()
        {
            var it = this.ChangeTree.iterator(), Num;
            while((Num = it.next()) !== null)
            {
                this.UpdateByNum(Num)
            }

            this.ChangeTree.clear()
        }

        UpdateByNum(Num)
        {
            var MaxNum = this.GetMaxNum();
            if(Num > MaxNum)
                return;

            var Buf = this.Read(Num, 1);
            if(!Buf)
            {
                var StrError = "Update MerkleTree: Error reading on num: " + Num + " MaxNum=" + MaxNum;
                StopAndExit(StrError)
                return;
            }

            this.MerkleArr[Num] = GetHash(Buf)
            this.MerkleCalc[Num] = 1
        }

        CalcMerkleTree(bForceUpdate)
        {
            if(!this.MerkleTree || bForceUpdate)
            {
                this.MerkleCalc = {}
                this.MerkleTree = {LevelsHash:[this.MerkleArr], RecalcCount:0}
                var GetMaxNum = this.GetMaxNum();
                for(var num = 0; num <= GetMaxNum; num++)
                {
                    this.UpdateByNum(num)
                }
            }
            else
            {
                this.UpdateByChangeTree()
            }

            this.MerkleTree.RecalcCount = 0
            global.UpdateMerklTree(this.MerkleTree, this.MerkleCalc, 0)
            this.MerkleCalc = {}

            return this.MerkleTree.Root;
        }
        WriteInner(BufWrite, Position, CheckSize, MaxSize, bJournalRestoring)
        {
            var Position = super.WriteInner(BufWrite, Position, CheckSize, MaxSize);
            if(Position !== false)
            {
                var Num = Math.floor( + Position / this.DataSize);
                this.AddToUpdate(Num)
            }
            return Position;
        }

        Truncate(LastNum)
        {
            super.Truncate(LastNum)
            if(LastNum <= 0)
            {
                this.InitMerkleTree()
                return;
            }

            if(this.MerkleArr.length !== LastNum + 1)
            {
                this.MerkleArr.length = LastNum + 1
                this.MerkleCalc[LastNum] = 1
            }
        }
    };

    function GetHash(Buf)
    {
        var Hash;
        if(global.UPDATE_CODE_NEW_ACCHASH)
            Hash = sha3(Buf);
        else
            Hash = shaarr(Buf);
        return Hash;
    }

    return MerkleDBRow;
}