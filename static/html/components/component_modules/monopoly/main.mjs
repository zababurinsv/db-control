import game from "./game.mjs";
import monopoly from "./monopoly.mjs";

export default async (self)=>{

  let obj = await game['get']({
        input:'main',
        type:'monopoly',
        this:self['this']
    })
   await monopoly['get']({type:'addEventListener'},obj)
}


