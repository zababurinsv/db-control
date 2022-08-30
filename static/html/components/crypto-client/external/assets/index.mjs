import f_s_t from '/static/html/components/crypto-dex/external/assets/f_s_t.mjs'
export default async (type) =>{
  let out = {}
  switch (type) {
    default:
      out = f_s_t(true,type,'red',{},'test')
      break
  }
  return out
}

