#!/usr/bin/env node

const lol=o=>(o.name=o.name.toUpperCase(), o);
console.log(lol({ name: 'hello World' }));

// { name: 'HELLO WORLD' }

console.log([['HULK',['HORK!',[['Harambe <3 Peanut',[0]]]]]].flat(Infinity).map(Boolean));

// [ true, true, true, false ]
