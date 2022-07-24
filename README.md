[![Tests CI](https://github.com/alanfilho184/Kami-LRU-Cache/actions/workflows/test.yml/badge.svg)](https://github.com/alanfilho184/Kami-LRU-Cache/actions/workflows/test.yml)


# Kami-LRU-Cache
Este pacote é uma simples implementação de um cache em memória que automaticamente apaga items salvos após um tempo pre-definido sem uso (LRU).

Foi criado com a ideia de ser um modulo mais flexível e simples de se utilizar quando comparado com outras alternativas disponiveis atualmente, foi feito para ser utilizado em outros projetos meus (Kami e Kami-Site).
# Utilização
## Métodos
### `.set(key: String, value: Any, maxAge: Number): true`
### `.get(key: String): Any`
### `.delete(key: String): true`
### `.has(key: String): Boolean`
### `.length(): Number`
### `.clear(): true`
&nbsp;
## Propriedades
### `.map: Map<String, JSON>`
### `.maxAge: Number` *READ-ONLY*
### `.updateAgeOnGet: Boolean` *READ-ONLY*
### `.events: EventEmitter` *READ-ONLY*
&nbsp;
## Eventos
### `.on('keyAutoDelete') => key: String`
### `.on('keySet') => key: String`
### `.on('keyUpdateAge') => (key: String, newAge: Number)`
### `.on('keyGet') => key: String`
### `.on('keyHas') => (key: String, has: Boolean)`
### `.on('cacheLength') => length: Number`
### `.on('cacheClear') => void`
&nbsp;
## Inicialização
```js
const kami_cache = require("kami-lru-cache").kami_cache

const config = {
    maxAge: 600000, // Tempo máximo que o item pode permanecer no cache em milissegundos
    updateAgeOnGet: true, // Se o tempo máximo do item será redefinido sempre que ele for utilizado
    rateOfVerifyAgedKeys: 60000 // Tempo entre cada verficação de chaves que atingiram seu tempo máximo
}

const cache = new kami_cache(config)
```

## Utilização
### .set
```js
const meuItem = {
    atributo: "valor"
}

const meuItemAdicionado = cache.set("MinhaChave", meuItem, 300000)

// meuItemAdicionado = true
```

### .get
```js
const meuItem = cache.get("MinhaChave")

// meuItem = {
//    atributo: "valor"
// }
```

### .has
```js
const meuItemNoCache = cache.has("MinhaChave")

// meuItemNoCache = true
```

### .length
```js
const quantidadeDeItensNoCache = cache.length()

// quantidadeDeItensNoCache = 1
```

### .delete
```js
const meuItemApagado = cache.delete("MinhaChave")

// meuItemApagado = true
```

### .clear
```js
const meuCacheVazio = cache.clear()

// meuCacheVazio = true
```

## Eventos

### keyAutoDelete
```js
cache.events.on("keyAutoDelete", (key) => {
    //To Do
})
```

### keySet
```js
cache.events.on("keySet", (key) => {
    //To Do
})
```

### keyUpdateAge
```js
cache.events.on("keyUpdateAge", (key, newAge) => {
    //To Do
})
```

### keyGet
```js
cache.events.on("keyGet", (key) => {
    //To Do
})
```

### keyDelete
```js
cache.events.on("keyDelete", (key) => {
    //To Do
})
```

### keyHas
```js
cache.events.on("keyHas", (key, has) => {
    //To Do
})
```

### cacheLength
```js
cache.events.on("cacheLength", (length) => {
    //To Do
})
```

### cacheClear
```js
cache.events.on("cacheClear", () => {
    //To Do
})
```