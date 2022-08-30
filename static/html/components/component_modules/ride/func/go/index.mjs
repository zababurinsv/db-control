export default {

  addressFromString: `func addressFromString(env RideEnvironment, args ...rideType) (rideType, error) {
  s, err := stringArg(args)
  if err != nil {
    return nil, errors.Wrap(err, "addressFromString")
  }
  a, err := proto.NewAddressFromString(string(s))
  if err != nil {
    return rideUnit{}, nil
  }
  if a[1] != env.scheme() {
    return rideUnit{}, nil
  }
  return rideAddress(a), nil
}`,

  addressValueFromString: `func addressValueFromString(env RideEnvironment, args ...rideType) (rideType, error) {
  r, err := addressFromString(env, args...)
  if err != nil {
    return nil, errors.Wrap(err, "addressValueFromString")
  }
  if _, ok := r.(rideUnit); ok {
    return rideThrow("failed to extract from Unit value"), nil
  }
  return r, nil
}`,

  transactionByID: `func transactionByID(env RideEnvironment, args ...rideType) (rideType, error) {
  b, err := bytesArg(args)
  if err != nil {
    return nil, errors.Wrap(err, "transactionByID")
  }
  tx, err := env.state().NewestTransactionByID(b)
  if err != nil {
    if env.state().IsNotFound(err) {
      return rideUnit{}, nil
    }
    return nil, errors.Wrap(err, "transactionByID")
  }
  obj, err := transactionToObject(env.scheme(), tx)
  if err != nil {
    return nil, errors.Wrap(err, "transactionByID")
  }
  return obj, nil
}`,

  transactionHeightByID: `func transactionHeightByID(env RideEnvironment, args ...rideType) (rideType, error) {
  b, err := bytesArg(args)
  if err != nil {
    return nil, errors.Wrap(err, "transactionHeightByID")
  }
  h, err := env.state().NewestTransactionHeightByID(b)
  if err != nil {
    if env.state().IsNotFound(err) {
      return rideUnit{}, nil
    }
    return nil, errors.Wrap(err, "transactionHeightByID")
  }
  return rideInt(h), nil
}`,

  assetBalanceV3: `func assetBalanceV3(env RideEnvironment, args ...rideType) (rideType, error) {
  if err := checkArgs(args, 2); err != nil {
    return nil, errors.Wrap(err, "assetBalanceV3")
  }
  recipient, err := extractRecipient(args[0])
  if err != nil {
    return nil, errors.Wrap(err, "assetBalanceV3")
  }
  asset, err := extractAsset(args[1])
  if err != nil {
    return nil, errors.Wrap(err, "assetBalanceV3")
  }
  balance, err := env.state().NewestAccountBalance(recipient, asset)
  if err != nil {
    return nil, errors.Wrap(err, "assetBalanceV3")
  }
  return rideInt(balance), nil
}`,

  assetBalanceV4: `func assetBalanceV4(env RideEnvironment, args ...rideType) (rideType, error) {
  if err := checkArgs(args, 2); err != nil {
    return nil, errors.Wrap(err, "assetBalanceV4")
  }
  recipient, err := extractRecipient(args[0])
  if err != nil {
    return nil, errors.Wrap(err, "assetBalanceV4")
  }
  asset, err := extractAsset(args[1])
  if err != nil {
    return nil, errors.Wrap(err, "assetBalanceV4")
  }
  if len(asset) == 0 { // Additional check, empty asset's ID is not allowed any more
    return nil, errors.New("assetBalanceV4: empty asset ID")
  }
  balance, err := env.state().NewestAccountBalance(recipient, asset)
  if err != nil {
    return nil, errors.Wrap(err, "assetBalanceV4")
  }
  return rideInt(balance), nil
}`,

  intFromState: `func intFromState(env RideEnvironment, args ...rideType) (rideType, error) {
  r, k, err := extractRecipientAndKey(args)
  if err != nil {
    return rideUnit{}, nil
  }
  entry, err := env.state().RetrieveNewestIntegerEntry(r, k)
  if err != nil {
    return rideUnit{}, nil
  }
  return rideInt(entry.Value), nil
}`,

  bytesFromState: `func bytesFromState(env RideEnvironment, args ...rideType) (rideType, error) {
  r, k, err := extractRecipientAndKey(args)
  if err != nil {
    return rideUnit{}, nil
  }
  entry, err := env.state().RetrieveNewestBinaryEntry(r, k)
  if err != nil {
    return rideUnit{}, nil
  }
  return rideBytes(entry.Value), nil
}`,

  stringFromState: `func stringFromState(env RideEnvironment, args ...rideType) (rideType, error) {
  r, k, err := extractRecipientAndKey(args)
  if err != nil {
    return rideUnit{}, nil
  }
  entry, err := env.state().RetrieveNewestStringEntry(r, k)
  if err != nil {
    return rideUnit{}, nil
  }
  return rideString(entry.Value), nil
}`,

  booleanFromState: `func booleanFromState(env RideEnvironment, args ...rideType) (rideType, error) {
  r, k, err := extractRecipientAndKey(args)
  if err != nil {
    return rideUnit{}, nil
  }
  entry, err := env.state().RetrieveNewestBooleanEntry(r, k)
  if err != nil {
    return rideUnit{}, nil
  }
  return rideBoolean(entry.Value), nil
}`,

  addressFromRecipient: `func addressFromRecipient(env RideEnvironment, args ...rideType) (rideType, error) {
  if err := checkArgs(args, 1); err != nil {
    return nil, errors.Wrap(err, "addressFromRecipient")
  }
  switch r := args[0].(type) {
  case rideRecipient:
      if r.Address != nil {
        return rideAddress(*r.Address), nil
      }
    if r.Alias != nil {
      addr, err := env.state().NewestAddrByAlias(*r.Alias)
      if err != nil {
        return nil, errors.Wrap(err, "addressFromRecipient")
      }
      return rideAddress(addr), nil
    }
    return nil, errors.Errorf("addressFromRecipient: unable to get address from recipient '%s'", r)
  case rideAddress:
      return r, nil
  default:
    return nil, errors.Errorf("addressFromRecipient: unexpected argument type '%s'", args[0].instanceOf())
  }
}`,

  sigVerify: `func sigVerify(env RideEnvironment, args ...rideType) (rideType, error) {
  if err := checkArgs(args, 3); err != nil {
    return nil, errors.Wrap(err, "sigVerify")
  }
  message, ok := args[0].(rideBytes)
  if !ok {
    return nil, errors.Errorf("sigVerify: unexpected argument type '%s'", args[0].instanceOf())
  }
  if l := len(message); env != nil && !env.checkMessageLength(l) {
    return nil, errors.Errorf("sigVerify: invalid message size %d", l)
  }
  signature, ok := args[1].(rideBytes)
  if !ok {
    return nil, errors.Errorf("sigVerify: unexpected argument type '%s'", args[1].instanceOf())
  }
  pkb, ok := args[2].(rideBytes)
  if !ok {
    return nil, errors.Errorf("sigVerify: unexpected argument type '%s'", args[2].instanceOf())
  }
  pk, err := crypto.NewPublicKeyFromBytes(pkb)
  if err != nil {
    return rideBoolean(false), nil
  }
  sig, err := crypto.NewSignatureFromBytes(signature)
  if err != nil {
    return rideBoolean(false), nil
  }
  ok = crypto.Verify(pk, sig, message)
  return rideBoolean(ok), nil
}`,

  keccak256: `func keccak256(env RideEnvironment, args ...rideType) (rideType, error) {
  data, err := bytesOrStringArg(args)
  if err != nil {
    return nil, errors.Wrap(err, "keccak256")
  }
  if l := len(data); env != nil && !env.checkMessageLength(l) {
    return nil, errors.Errorf("keccak256: invalid data size %d", l)
  }
  d, err := crypto.Keccak256(data)
  if err != nil {
    return nil, errors.Wrap(err, "keccak256")
  }
  return rideBytes(d.Bytes()), nil
}`,

  blake2b256: `func blake2b256(env RideEnvironment, args ...rideType) (rideType, error) {
  data, err := bytesOrStringArg(args)
  if err != nil {
    return nil, errors.Wrap(err, "blake2b256")
  }
  if l := len(data); env != nil && !env.checkMessageLength(l) {
    return nil, errors.Errorf("blake2b256: invalid data size %d", l)
  }
  d, err := crypto.FastHash(data)
  if err != nil {
    return nil, errors.Wrap(err, "blake2b256")
  }
  return rideBytes(d.Bytes()), nil
}`,

  sha256: `func sha256(env RideEnvironment, args ...rideType) (rideType, error) {
  data, err := bytesOrStringArg(args)
  if err != nil {
    return nil, errors.Wrap(err, "sha256")
  }
  if l := len(data); env != nil && !env.checkMessageLength(l) {
    return nil, errors.Errorf("sha256: invalid data size %d", l)
  }
  h := sh256.New()
  if _, err = h.Write(data); err != nil {
    return nil, errors.Wrap(err, "sha256")
  }
  d := h.Sum(nil)
  return rideBytes(d), nil
}`,

  addressFromPublicKey: `func addressFromPublicKey(env RideEnvironment, args ...rideType) (rideType, error) {
  b, err := bytesArg(args)
  if err != nil {
    return nil, errors.Wrap(err, "addressFromPublicKey")
  }
  addr, err := proto.NewAddressLikeFromAnyBytes(env.scheme(), b)
  if err != nil {
    return rideUnit{}, nil
  }
  return rideAddress(addr), nil
}`,

  wavesBalanceV3: `func wavesBalanceV3(env RideEnvironment, args ...rideType) (rideType, error) {
  if err := checkArgs(args, 1); err != nil {
    return nil, errors.Wrap(err, "wavesBalanceV3")
  }
  recipient, err := extractRecipient(args[0])
  if err != nil {
    return nil, errors.Wrap(err, "wavesBalanceV3")
  }
  balance, err := env.state().NewestAccountBalance(recipient, nil)
  if err != nil {
    return nil, errors.Wrap(err, "wavesBalanceV3")
  }
  return rideInt(balance), nil
}`,

  wavesBalanceV4: `func wavesBalanceV4(env RideEnvironment, args ...rideType) (rideType, error) {
  if err := checkArgs(args, 1); err != nil {
    return nil, errors.Wrap(err, "wavesBalanceV4")
  }
  r, err := extractRecipient(args[0])
  if err != nil {
    return nil, errors.Wrap(err, "wavesBalanceV4")
  }
  balance, err := env.state().NewestFullWavesBalance(r)
  if err != nil {
    return nil, errors.Wrapf(err, "wavesBalanceV4(%s)", r.String())
  }
  return balanceDetailsToObject(balance), nil
}`,

  assetInfoV3: `func assetInfoV3(env RideEnvironment, args ...rideType) (rideType, error) {
  b, err := bytesArg(args)
  if err != nil {
    return nil, errors.Wrap(err, "assetInfoV3")
  }
  asset, err := crypto.NewDigestFromBytes(b)
  if err != nil {
    return rideUnit{}, nil
  }
  info, err := env.state().NewestAssetInfo(asset)
  if err != nil {
    return rideUnit{}, nil
  }
  return assetInfoToObject(info), nil
}`,

  assetInfoV4: `func assetInfoV4(env RideEnvironment, args ...rideType) (rideType, error) {
  b, err := bytesArg(args)
  if err != nil {
    return nil, errors.Wrap(err, "assetInfoV4")
  }
  asset, err := crypto.NewDigestFromBytes(b)
  if err != nil {
    return rideUnit{}, nil
  }
  info, err := env.state().NewestFullAssetInfo(asset)
  if err != nil {
    return rideUnit{}, nil
  }
  return fullAssetInfoToObject(info), nil
}`,

  blockInfoByHeight: `func blockInfoByHeight(env RideEnvironment, args ...rideType) (rideType, error) {
  i, err := intArg(args)
  if err != nil {
    return nil, errors.Wrap(err, "blockInfoByHeight")
  }
  height := proto.Height(i)
  header, err := env.state().NewestHeaderByHeight(height)
  if err != nil {
    return nil, errors.Wrap(err, "blockInfoByHeight")
  }
  vrf, err := env.state().BlockVRF(header, height)
  if err != nil {
    return nil, errors.Wrap(err, "blockInfoByHeight")
  }
  obj, err := blockHeaderToObject(env.scheme(), header, vrf)
  if err != nil {
    return nil, errors.Wrap(err, "blockInfoByHeight")
  }
  return obj, nil
}`,

  transferByID: `func transferByID(env RideEnvironment, args ...rideType) (rideType, error) {
  b, err := bytesArg(args)
  if err != nil {
    return nil, errors.Wrap(err, "transferByID")
  }
  tx, err := env.state().NewestTransactionByID(b)
  if err != nil {
    if env.state().IsNotFound(err) {
      return rideUnit{}, nil
    }
    return nil, errors.Wrap(err, "transferByID")
  }
  obj, err := transactionToObject(env.scheme(), tx)
  if err != nil {
    return nil, errors.Wrap(err, "transferByID")
  }
  return obj, nil
}`,

  addressToString: `func addressToString(_ RideEnvironment, args ...rideType) (rideType, error) {
  if err := checkArgs(args, 1); err != nil {
    return nil, errors.Wrap(err, "addressToString")
  }
  switch a := args[0].(type) {
  case rideAddress:
      return rideString(proto.Address(a).String()), nil
  case rideRecipient:
      if a.Address == nil {
        return nil, errors.Errorf("addressToString: recipient is not an Address '%s'", args[0].instanceOf())
      }
    return rideString(a.Address.String()), nil
  default:
    return nil, errors.Errorf("addressToString: invalid argument type '%s'", args[0].instanceOf())
  }
}`,

  rsaVerify: `func rsaVerify(_ RideEnvironment, args ...rideType) (rideType, error) {
  if err := checkArgs(args, 4); err != nil {
    return nil, errors.Wrap(err, "rsaVerify")
  }
  digest, err := digest(args[0])
  if err != nil {
    return nil, errors.Wrap(err, "rsaVerify")
  }
  message, ok := args[1].(rideBytes)
  if !ok {
    return nil, errors.Errorf("rsaVerify: unexpected argument type '%s'", args[1].instanceOf())
  }
  sig, ok := args[2].(rideBytes)
  if !ok {
    return nil, errors.Errorf("rsaVerify: unexpected argument type '%s'", args[2].instanceOf())
  }
  pk, ok := args[3].(rideBytes)
  if !ok {
    return nil, errors.Errorf("rsaVerify unexpected argument type '%s'", args[3].instanceOf())
  }
  key, err := x509.ParsePKIXPublicKey(pk)
  if err != nil {
    return nil, errors.Wrap(err, "rsaVerify: invalid public key")
  }
  k, ok := key.(*rsa.PublicKey)
  if !ok {
    return nil, errors.New("rsaVerify: not an RSA key")
  }
  d := message
  if digest != 0 {
    h := digest.New()
    _, _ = h.Write(message)
    d = h.Sum(nil)
  }
  ok, err = c2.VerifyPKCS1v15(k, digest, d, sig)
  if err != nil {
    return nil, errors.Wrap(err, "rsaVerify")
  }
  return rideBoolean(ok), nil
}`,

  checkMerkleProof: `func checkMerkleProof(_ RideEnvironment, args ...rideType) (rideType, error) {
  if err := checkArgs(args, 3); err != nil {
    return nil, errors.Wrap(err, "checkMerkleProof")
  }
  root, ok := args[0].(rideBytes)
  if !ok {
    return nil, errors.Errorf("checkMerkleProof: unexpected argument type '%s'", args[0].instanceOf())
  }
  proof, ok := args[1].(rideBytes)
  if !ok {
    return nil, errors.Errorf("checkMerkleProof: unexpected argument type '%s'", args[1].instanceOf())
  }
  leaf, ok := args[2].(rideBytes)
  if !ok {
    return nil, errors.Errorf("checkMerkleProof: unexpected argument type '%s'", args[2].instanceOf())
  }
  r, err := c2.MerkleRootHash(leaf, proof)
  if err != nil {
    return nil, errors.Wrap(err, "checkMerkleProof")
  }
  return rideBoolean(bytes.Equal(root, r)), nil
}`,

  intValueFromState: `func intValueFromState(env RideEnvironment, args ...rideType) (rideType, error) {
  v, err := intFromState(env, args...)
  if err != nil {
    return nil, err
  }
  return extractValue(v)
}`,

  booleanValueFromState: `func booleanValueFromState(env RideEnvironment, args ...rideType) (rideType, error) {
  v, err := booleanFromState(env, args...)
  if err != nil {
    return nil, err
  }
  return extractValue(v)
}`,

  bytesValueFromState: `func bytesValueFromState(env RideEnvironment, args ...rideType) (rideType, error) {
  v, err := bytesFromState(env, args...)
  if err != nil {
    return nil, err
  }
  return extractValue(v)
}`,

  stringValueFromState: `func stringValueFromState(env RideEnvironment, args ...rideType) (rideType, error) {
  v, err := stringFromState(env, args...)
  if err != nil {
    return nil, err
  }
  return extractValue(v)
}`,

  transferFromProtobuf: `func transferFromProtobuf(env RideEnvironment, args ...rideType) (rideType, error) {
  b, err := bytesArg(args)
  if err != nil {
    return nil, errors.Wrap(err, "transferFromProtobuf")
  }
  tx := new(proto.TransferWithProofs)
  err = tx.UnmarshalSignedFromProtobuf(b)
  if err != nil {
    return nil, errors.Wrap(err, "transferFromProtobuf")
  }
  //TODO: using scope's scheme is not quite correct here, because it should be possible to validate transfers from other networks
  err = tx.GenerateID(env.scheme())
  if err != nil {
    return nil, errors.Wrap(err, "transferFromProtobuf")
  }
  obj, err := transferWithProofsToObject(env.scheme(), tx)
  if err != nil {
    return nil, errors.Wrap(err, "transferFromProtobuf")
  }
  return obj, nil
}`,

  calcAssetID: `func calcAssetID(env RideEnvironment, name, description rideString, decimals, quantity rideInt, reissuable rideBoolean, nonce rideInt) (rideBytes, error) {
  pid, ok := env.txID().(rideBytes)
  if !ok {
    return nil, errors.New("calculateAssetID: no parent transaction ID found")
  }
  d, err := crypto.NewDigestFromBytes(pid)
  if err != nil {
    return nil, errors.Wrap(err, "calculateAssetID")
  }
  id := proto.GenerateIssueScriptActionID(string(name), string(description), int64(decimals), int64(quantity), bool(reissuable), int64(nonce), d)
  return id.Bytes(), nil
}`,

  calculateAssetID: `func calculateAssetID(env RideEnvironment, args ...rideType) (rideType, error) {
  if err := checkArgs(args, 1); err != nil {
    return nil, errors.Wrap(err, "calculateAssetID")
  }
  if t := args[0].instanceOf(); t != "Issue" {
    return nil, errors.Errorf("calculateAssetID: unexpected argument type '%s'", t)
  }
  issue, ok := args[0].(rideObject)
  if !ok {
    return nil, errors.New("calculateAssetID: not an object")
  }
  name, err := stringProperty(issue, "name")
  if err != nil {
    return nil, errors.Wrap(err, "calculateAssetID")
  }
  description, err := stringProperty(issue, "description")
  if err != nil {
    return nil, errors.Wrap(err, "calculateAssetID")
  }
  decimals, err := intProperty(issue, "decimals")
  if err != nil {
    return nil, errors.Wrap(err, "calculateAssetID")
  }
  quantity, err := intProperty(issue, "quantity")
  if err != nil {
    return nil, errors.Wrap(err, "calculateAssetID")
  }
  reissuable, err := booleanProperty(issue, "isReissuable")
  if err != nil {
    return nil, errors.Wrap(err, "calculateAssetID")
  }
  nonce, err := intProperty(issue, "nonce")
  if err != nil {
    return nil, errors.Wrap(err, "calculateAssetID")
  }
  return calcAssetID(env, name, description, decimals, quantity, reissuable, nonce)
}`,

  simplifiedIssue: `func simplifiedIssue(_ RideEnvironment, args ...rideType) (rideType, error) {
  if err := checkArgs(args, 5); err != nil {
    return nil, errors.Wrap(err, "simplifiedIssue")
  }
  name, ok := args[0].(rideString)
  if !ok {
    return nil, errors.Errorf("calculateAssetID: unexpected argument type '%s'", args[0].instanceOf())
  }
  description, ok := args[1].(rideString)
  if !ok {
    return nil, errors.Errorf("calculateAssetID: unexpected argument type '%s'", args[1].instanceOf())
  }
  quantity, ok := args[2].(rideInt)
  if !ok {
    return nil, errors.Errorf("calculateAssetID: unexpected argument type '%s'", args[2].instanceOf())
  }
  decimals, ok := args[3].(rideInt)
  if !ok {
    return nil, errors.Errorf("calculateAssetID: unexpected argument type '%s'", args[3].instanceOf())
  }
  reissuable, ok := args[4].(rideBoolean)
  if !ok {
    return nil, errors.Errorf("calculateAssetID: unexpected argument type '%s'", args[4].instanceOf())
  }
  return newIssue(name, description, quantity, decimals, reissuable, rideUnit{}, 0), nil
}`,

  fullIssue: `func fullIssue(_ RideEnvironment, args ...rideType) (rideType, error) {
  if err := checkArgs(args, 7); err != nil {
    return nil, errors.Wrap(err, "simplifiedIssue")
  }
  name, ok := args[0].(rideString)
  if !ok {
    return nil, errors.Errorf("calculateAssetID: unexpected argument type '%s'", args[0].instanceOf())
  }
  description, ok := args[1].(rideString)
  if !ok {
    return nil, errors.Errorf("calculateAssetID: unexpected argument type '%s'", args[1].instanceOf())
  }
  quantity, ok := args[2].(rideInt)
  if !ok {
    return nil, errors.Errorf("calculateAssetID: unexpected argument type '%s'", args[2].instanceOf())
  }
  decimals, ok := args[3].(rideInt)
  if !ok {
    return nil, errors.Errorf("calculateAssetID: unexpected argument type '%s'", args[3].instanceOf())
  }
  reissuable, ok := args[4].(rideBoolean)
  if !ok {
    return nil, errors.Errorf("calculateAssetID: unexpected argument type '%s'", args[4].instanceOf())
  }
  var script rideType
  switch s := args[5].(type) {
  case rideBytes:
      script = s
  case rideUnit:
      script = s
  default:
    return nil, errors.Errorf("calculateAssetID: unexpected argument type '%s'", args[5].instanceOf())
  }
    nonce, ok := args[6].(rideInt)
    if !ok {
      return nil, errors.Errorf("calculateAssetID: unexpected argument type '%s'", args[6].instanceOf())
    }
    return newIssue(name, description, quantity, decimals, reissuable, script, nonce), nil
}`,

  rebuildMerkleRoot: `func rebuildMerkleRoot(_ RideEnvironment, args ...rideType) (rideType, error) {
  if err := checkArgs(args, 3); err != nil {
    return nil, errors.Wrap(err, "rebuildMerkleRoot")
  }
  proofs, ok := args[0].(rideList)
  if !ok {
    return nil, errors.Errorf("rebuildMerkleRoot: unexpected argument type '%s'", args[0].instanceOf())
  }
  if l := len(proofs); l > 16 {
    return nil, errors.New("rebuildMerkleRoot: no more than 16 proofs is allowed")
  }
  pfs := make([]crypto.Digest, len(proofs))
  for i, x := range proofs {
    b, ok := x.(rideBytes)
    if !ok {
      return nil, errors.Errorf("rebuildMerkleRoot: unexpected proof type '%s' at position %d", x.instanceOf(), i)
    }
    d, err := crypto.NewDigestFromBytes(b)
    if err != nil {
      return nil, errors.Wrap(err, "rebuildMerkleRoot")
    }
    pfs[i] = d
  }
  leaf, ok := args[1].(rideBytes)
  if !ok {
    return nil, errors.Errorf("rebuildMerkleRoot: unexpected argument type '%s'", args[1].instanceOf())
  }
  lf, err := crypto.NewDigestFromBytes(leaf)
  if err != nil {
    return nil, errors.Wrap(err, "rebuildMerkleRoot")
  }
  index, ok := args[2].(rideInt)
  if !ok {
    return nil, errors.Errorf("rebuildMerkleRoot: unexpected argument type '%s'", args[2].instanceOf())
  }
  idx := uint64(index)
  tree, err := crypto.NewMerkleTree()
  if err != nil {
    return nil, errors.Wrap(err, "rebuildMerkleRoot")
  }
  root := tree.RebuildRoot(lf, pfs, idx)
  return rideBytes(root[:]), nil
}`,

  bls12Groth16Verify: `func bls12Groth16Verify(_ RideEnvironment, _ ...rideType) (rideType, error) {
  //TODO: implement
  return rideBoolean(true), nil
}`,

  bn256Groth16Verify: `func bn256Groth16Verify(_ RideEnvironment, _ ...rideType) (rideType, error) {
  //TODO: implement
  return rideBoolean(true), nil
}`,

  ecRecover: `func ecRecover(_ RideEnvironment, args ...rideType) (rideType, error) {
  digest, signature, err := bytesArgs2(args)
  if err != nil {
    return nil, errors.Wrap(err, "ecRecover")
  }
  if l := len(digest); l != 32 {
    return nil, errors.Errorf("ecRecover: invalid message digest size %d, expected 32 bytes", l)
  }
  if l := len(signature); l != 65 {
    return nil, errors.Errorf("ecRecover: invalid signature size %d, expected 65 bytes", l)
  }
  pk, err := crypto.ECDSARecoverPublicKey(digest, signature)
  if err != nil {
    return nil, errors.Wrapf(err, "ecRecover")
  }
  pkb := pk.SerializeUncompressed()
  //We have to drop first byte because in bitcoin library where is a length.
  return rideBytes(pkb[1:]), nil
}`,

  checkedBytesDataEntry: `func checkedBytesDataEntry(_ RideEnvironment, args ...rideType) (rideType, error) {
  if err := checkArgs(args, 2); err != nil {
    return nil, errors.Wrap(err, "checkedBytesDataEntry")
  }
  key, ok := args[0].(rideString)
  if !ok {
    return nil, errors.Errorf("checkedBytesDataEntry: unexpected argument type '%s'", args[0].instanceOf())
  }
  value, ok := args[1].(rideBytes)
  if !ok {
    return nil, errors.Errorf("checkedBytesDataEntry: unexpected argument type '%s'", args[0].instanceOf())
  }
  return newDataEntry("BinaryEntry", key, value), nil
}`,

  checkedBooleanDataEntry: `func checkedBooleanDataEntry(_ RideEnvironment, args ...rideType) (rideType, error) {
  if err := checkArgs(args, 2); err != nil {
    return nil, errors.Wrap(err, "checkedBooleanDataEntry")
  }
  key, ok := args[0].(rideString)
  if !ok {
    return nil, errors.Errorf("checkedBooleanDataEntry: unexpected argument type '%s'", args[0].instanceOf())
  }
  value, ok := args[1].(rideBoolean)
  if !ok {
    return nil, errors.Errorf("checkedBooleanDataEntry: unexpected argument type '%s'", args[0].instanceOf())
  }
  return newDataEntry("BooleanEntry", key, value), nil
}`,

  checkedDeleteEntry: `func checkedDeleteEntry(_ RideEnvironment, args ...rideType) (rideType, error) {
  key, err := stringArg(args)
  if err != nil {
    return nil, errors.Wrap(err, "checkedDeleteEntry")
  }
  return newDataEntry("DeleteEntry", key, rideUnit{}), nil
}`,

  checkedIntDataEntry: `func checkedIntDataEntry(_ RideEnvironment, args ...rideType) (rideType, error) {
  if err := checkArgs(args, 2); err != nil {
    return nil, errors.Wrap(err, "checkedIntDataEntry")
  }
  key, ok := args[0].(rideString)
  if !ok {
    return nil, errors.Errorf("checkedIntDataEntry: unexpected argument type '%s'", args[0].instanceOf())
  }
  value, ok := args[1].(rideInt)
  if !ok {
    return nil, errors.Errorf("checkedIntDataEntry: unexpected argument type '%s'", args[0].instanceOf())
  }
  return newDataEntry("IntegerEntry", key, value), nil
}`,

  checkedStringDataEntry: `func checkedStringDataEntry(_ RideEnvironment, args ...rideType) (rideType, error) {
  if err := checkArgs(args, 2); err != nil {
    return nil, errors.Wrap(err, "checkedStringDataEntry")
  }
  key, ok := args[0].(rideString)
  if !ok {
    return nil, errors.Errorf("checkedStringDataEntry: unexpected argument type '%s'", args[0].instanceOf())
  }
  value, ok := args[1].(rideString)
  if !ok {
    return nil, errors.Errorf("checkedStringDataEntry: unexpected argument type '%s'", args[0].instanceOf())
  }
  return newDataEntry("StringEntry", key, value), nil
}`
}