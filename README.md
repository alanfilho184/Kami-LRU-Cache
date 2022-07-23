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