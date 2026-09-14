/* PWA stand-in for Secure Enclave. AES-256-GCM. Key in IndexedDB, non-extractable when possible. */
(function(g){
  const DB="algiz-vault", STORE="keys";
  function idb(){
    return new Promise(function(ok,err){
      const r=indexedDB.open(DB,1);
      r.onupgradeneeded=function(){ r.result.createObjectStore(STORE); };
      r.onsuccess=function(){ ok(r.result); };
      r.onerror=function(){ err(r.error); };
    });
  }
  async function loadKey(){
    const db=await idb();
    const key=await new Promise(function(ok,err){
      const t=db.transaction(STORE,"readonly").objectStore(STORE).get("master");
      t.onsuccess=function(){ ok(t.result||null); };
      t.onerror=function(){ err(t.error); };
    });
    if(key) return key;
    const fresh=await crypto.subtle.generateKey({name:"AES-GCM",length:256}, false, ["encrypt","decrypt"]);
    const db2=await idb();
    await new Promise(function(ok,err){
      const t=db2.transaction(STORE,"readwrite").objectStore(STORE).put(fresh,"master");
      t.onsuccess=function(){ ok(); };
      t.onerror=function(){ err(t.error); };
    });
    return fresh;
  }
  function buf(s){ return new TextEncoder().encode(s); }
  function str(b){ return new TextDecoder().decode(b); }
  function b64(bytes){
    let s=""; const a=new Uint8Array(bytes);
    for(let i=0;i<a.length;i++) s+=String.fromCharCode(a[i]);
    return btoa(s);
  }
  function unb64(s){
    const bin=atob(s); const a=new Uint8Array(bin.length);
    for(let i=0;i<bin.length;i++) a[i]=bin.charCodeAt(i);
    return a;
  }
  g.AlgizVault={
    async save(obj){
      const key=await loadKey();
      const iv=crypto.getRandomValues(new Uint8Array(12));
      const ct=await crypto.subtle.encrypt({name:"AES-GCM",iv:iv}, key, buf(JSON.stringify(obj)));
      localStorage.setItem("algiz-blob", JSON.stringify({iv:b64(iv),ct:b64(ct)}));
    },
    async load(){
      const raw=localStorage.getItem("algiz-blob");
      if(!raw) return {lifts:[],supps:[],heats:[],gate:false};
      try{
        const pack=JSON.parse(raw);
        const key=await loadKey();
        const pt=await crypto.subtle.decrypt({name:"AES-GCM",iv:unb64(pack.iv)}, key, unb64(pack.ct));
        return Object.assign({lifts:[],supps:[],heats:[],gate:false}, JSON.parse(str(pt)));
      }catch(e){
        return {lifts:[],supps:[],heats:[],gate:false};
      }
    }
  };
})(window);
