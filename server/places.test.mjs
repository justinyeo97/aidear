import test from 'node:test';
import assert from 'node:assert/strict';
import {placesMiddleware, normalizePlaces} from './places.mjs';

async function request(handler, url) {
  let status, body;
  await handler({url, method:'GET', socket:{remoteAddress:'test'}}, {
    writeHead(code){status=code;}, setHeader(){}, end(value){body=JSON.parse(value);},
  },()=>{throw Error('Unexpected next handler')});
  return {status, body};
}

test('requires a city and configured key before contacting provider',async()=>{
  let calls=0;
  const handler=placesMiddleware(()=>'',async()=>{calls++;});
  assert.equal((await request(handler,'/api/places?idea=coffee')).status,400);
  assert.equal((await request(handler,'/api/places?idea=coffee&location=Test')).status,503);
  assert.equal((await request(handler,'/api/places?idea=toString&location=Test')).status,400);
  assert.equal(calls,0);
});

test('keeps provider credentials and metadata outside normalized cached response',async()=>{
  let calls=0;
  const handler=placesMiddleware(()=>'private-test-key',async url=>{
    calls++;
    assert.equal(new URL(url).searchParams.get('api_key'),'private-test-key');
    return {ok:true,json:async()=>({search_metadata:{json_endpoint:'private-test-key'},local_results:[{place_id:'123',title:'Test Cafe',address:'Test Road',rating:4.5}]})};
  });
  const result=await request(handler,'/api/places?idea=coffee&location=Testtown');
  assert.equal(result.status,200);
  assert.equal(result.body.places[0].id,'123');
  assert.equal(JSON.stringify(result).includes('private-test-key'),false);
  await request(handler,'/api/places?idea=coffee&location=Testtown');
  assert.equal(calls,1);
});

test('handles provider quota failures without exposing raw provider errors',async()=>{
  const handler=placesMiddleware(()=>'secret',async()=>({ok:false,status:429}));
  const result=await request(handler,'/api/places?idea=park&location=Othercity');
  assert.equal(result.status,502);
  assert.match(result.body.error,/quota/);
});

test('normalizes optional fields and excludes unsafe thumbnail URLs',()=>{
  const places=normalizePlaces({local_results:[{title:'Gallery',thumbnail:'javascript:alert(1)'},{address:'Missing title'}]});
  assert.equal(places.length,1);
  assert.equal(places[0].image,null);
  assert.equal(places[0].rating,null);
  assert.equal(new URL(places[0].mapsUrl).hostname,'www.google.com');
});
