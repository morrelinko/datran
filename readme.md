## Datran

Data Transformer

Use Case: API Response Formatter

** NOTE ** This is a work in Progress

### Quick Example

```js
const express = require('app')
const datran = require('datran')

let app = express()

app.get('/user', async function(req, res) {
  let resource = datran.item(await User.find(1))

  let data = await datran.create(resource, new UserTransformer()).toObject()

  res.status(200).json(data)
})
```

```js
const { Transformer } = require('datran')

const UserTransformer = Transformer.create({
  transform(user) {
    return {
      id: user.get('_id'),
      full_name: user.get('fullName')
    }
  }
})
```

or

```js
const { Transformer } = require('datran')

class UserTransformer extends Transformer {
  transform(user) {
    return {
      // formatted user data
    }
  }
}
```
