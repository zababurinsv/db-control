export default {
    button:[
        {
            '/':'button',
            property:{
                "{{#each items}}": {
                    '/': "button",
                    item: "{{this}}",
                    action:{
                        "{{#concat}}":
                            [{
                                '/':'tradeMoneyOnKeyDown',
                                event:  {"{{#concat}}":['onkeydown', 'onfocus', 'onchange']}
                            }, {
                                '/':'tradeMoneyOnFocus',
                                event:  {"{{#concat}}":['onkeydown', 'onfocus', 'onchange']}
                            },{
                                '/':'tradeMoneyOnChange',
                                event:  {"{{#concat}}":['onkeydown', 'onfocus', 'onchange']}
                        }]
                    }

                }
            },
            substrate: {
                '/':'button',
                type:'default',
                items: ['trade-leftp-money','trade-rightp-money'],
            },
        },
    ],
    player:[
        {
            '/':'player',
            property:{
                "{{#each items}}": {
                    '/': "player",
                    item: "{{this}}",
                    type:'default',
                    action:{
                        "{{#concat}}":
                            [{
                                '/':'playernumber_onchange',
                                event:  {"{{#concat}}":['onkeydown', 'onfocus', 'onchange']}
                            }, {
                                '/':'tradeMoneyOnFocus',
                                event:  {"{{#concat}}":['onkeydown', 'onfocus', 'onchange']}
                            },{
                                '/':'tradeMoneyOnChange',
                                event:  {"{{#concat}}":['onkeydown', 'onfocus', 'onchange']}
                            },{
                                '/':'playernumber_onchange',
                                event:  {"{{#concat}}":['onkeydown', 'onfocus', 'onchange']}
                            }]
                    },

                    relations:{
                        "{{#concat}}":[
                            {
                                '/':'name',
                                name:'default',
                            },
                            {
                                '/':'type',
                                type: 'default',

                            },{
                                '/':'pcount',
                                pcount: false,
                            },{
                                '/':'currentCell',
                                currentCell: 0,

                            },{
                                '/':'currentCellAnchor',
                                currentCellAnchor: 0,

                            },{
                                '/':'currentCellPositionHolder',
                                currentCellPositionHolder: 0,

                            },{
                                '/':'currentCellName',
                                currentCellName: 0,

                            },{
                                '/':'currentCellOwner',
                                currentCellOwner: 0,

                            },{
                                '/':'jail',
                                jail: false,

                            },{
                                '/':'cell',
                                cell:0
                            }
                        ]
                    }
                }
            },
            substrate: {
                player: [],
                type:'default',
                items: ['bank','player 1','player 2','player 3','player 4','player 5','player 6','player 7','player 8'],
            },
        },
    ],
}
