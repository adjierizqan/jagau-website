type Counters={day:string;requests:number;units:number;visitors:Record<string,{minute:number;count:number}>};
type Storage={get<T>(key:string):Promise<T|undefined>;put(key:string,value:unknown):Promise<void>;transaction<T>(fn:(tx:Storage)=>Promise<T>):Promise<T>};
export class GuideBudget {
  private state:{storage:Storage};
  constructor(state:{storage:Storage}) {this.state=state;}
  async fetch(request:Request) {
    if(request.method!=="POST")return new Response(null,{status:405});
    const input=await request.json() as {visitor:string;units:number};
    if(!/^[a-f0-9]{64}$/.test(input.visitor)||!Number.isInteger(input.units)||input.units<1||input.units>20000)return new Response(null,{status:400});
    const now=new Date();const day=now.toISOString().slice(0,10);const minute=Math.floor(now.getTime()/60000);
    const ok=await this.state.storage.transaction(async tx=>{
      let counter=await tx.get<Counters>("budget");
      if(counter?.day!==day)counter={day,requests:0,units:0,visitors:{}};
      const previous=counter.visitors[input.visitor];const count=previous?.minute===minute?previous.count:0;
      // Atomic reservations before inference. Never refund errors/timeouts: fail closed.
      if(counter.requests>=30||counter.units+input.units>100000||count>=5)return false;
      counter.requests++;counter.units+=input.units;counter.visitors[input.visitor]={minute,count:count+1};
      await tx.put("budget",counter);return true;
    });
    return new Response(null,{status:ok?204:429});
  }
}
