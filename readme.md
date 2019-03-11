# Datran

This library is inspired by the REST APIS Best practices & the Fractal library.

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
  async transform(user) {
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
  async transform(user) {
    return {
      // formatted user data
    }
  }
}
```

### Embedded Resources

* Specify an `availableIncludes` array in the transformer and and optional `defaultIncludes` array.
* Implement an `include{EmbeddedResource}` in the transformer, which should call a separate Transformer.


```js
class CommentTransformer extends Transformer {
  async transform(comment) {
    return {
      //formatted comments
    }
  }
}

class UserTransformer extends Transformer {
  get availableIncludes() {
    return ['comments']
  }

  get defaultIncludes() {
    return ['comments']
  }

  async transform(user) {
    return {
      // formatted user data
    }
  }
  
  includeComments(user) {
    if (user.comments)
      return this.collection(user.comments, new CommentTransformer())
  }
}
```

When creating the datran resource, create an options object with a `fields` array, containing the resources to embed.

```js
const opts = {
  fields: ['comments']
}

app.get('/user', async function(req, res) {
  const user = await User.find(1).populate('comments') //a user with a "comments" array
  let resource = datran.item(user, opts)
  let data = await datran.create(resource, new UserTransformer()).toObject()

  res.status(200).json(data)
})
```

### Resource Types

TODO Docs

### Custom Data Serializer

TODO Docs

### Custom Fields Parser

TODO Docs
