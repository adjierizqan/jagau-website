export async function readBoundedBody(body:ReadableStream<Uint8Array>|null,limit:number,signal:AbortSignal):Promise<string> {
  if(!body)throw Error("EMPTY_BODY");
  const reader=body.getReader();let length=0;let text="";const decoder=new TextDecoder();
  const abort=()=>{void reader.cancel();};signal.addEventListener("abort",abort,{once:true});
  try {
    while(true){if(signal.aborted)throw Error("BODY_ABORTED");const value=await reader.read();if(signal.aborted)throw Error("BODY_ABORTED");if(value.done)break;length+=value.value.length;if(length>limit)throw Error("BODY_LIMIT");text+=decoder.decode(value.value,{stream:true});}
    return text+decoder.decode();
  } finally {signal.removeEventListener("abort",abort);await reader.cancel();reader.releaseLock();}
}
