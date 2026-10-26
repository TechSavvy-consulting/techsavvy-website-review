import assert from 'node:assert/strict';
import { isFormspreeSuccess, getFormspreeFieldErrors } from '../src/utils/formspree-response.ts';
import { contactFormConfig, getContactFormEndpoint } from '../src/data/contact-form.ts';

assert.equal(getContactFormEndpoint(), 'https://formspree.io/f/mvkkkwyn');
const original = contactFormConfig.endpoint;
try {
  contactFormConfig.endpoint = '';
  assert.equal(getContactFormEndpoint(), null);
  for (const endpoint of ['http://formspree.io/f/test','https://evil.example/f/test','https://formspree.io.evil.example/f/test','https://formspree.io/f/test?key=value','https://formspree.io/f/test#fragment','https://user:password@formspree.io/f/test','https://formspree.io:8443/f/test','https://formspree.io/sales@example.com']) {
    contactFormConfig.endpoint = endpoint;
    assert.throws(getContactFormEndpoint, undefined, endpoint);
  }
} finally {
  contactFormConfig.endpoint = original;
}

assert.equal(isFormspreeSuccess(true,'application/json',{ok:true}),true);
assert.equal(isFormspreeSuccess(true,'application/json; charset=utf-8',{ok:true,errors:[]}),true);
for (const [httpOk,type,data] of [[false,'application/json',{ok:true}],[true,'text/html',{ok:true}],[true,null,{ok:true}],[true,'application/json',null],[true,'application/json',{}],[true,'application/json',{ok:false}],[true,'application/json',{ok:'true'}],[true,'application/json',{ok:true,error:'failed'}],[true,'application/json',{ok:true,errors:[{message:'Rejected'}]}]]) {
  assert.equal(isFormspreeSuccess(httpOk,type,data),false);
}
assert.deepEqual(getFormspreeFieldErrors(null),[]);
assert.deepEqual(getFormspreeFieldErrors({errors:[null,'bad',{field:4,message:'bad'},{field:'email',message:8}]}),[]);
assert.deepEqual(getFormspreeFieldErrors({errors:[{field:'email',message:'Check this email'}]}),[{field:'email',message:'Check this email'}]);
assert.equal(getFormspreeFieldErrors({errors:[{field:'email',message:'x'.repeat(500)}]})[0].message.length,240);
console.log('PASS: form endpoint allowlist, absent-endpoint fallback, strict success handling and safe field-error parsing. No network requests sent.');
