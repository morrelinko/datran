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

### Embedded Resources

Working with embedded resources

Example Request

```
https://api.sample.test/thread?fields=post,post.comments:limit(5|1)
```

The `fields` query describes:

IncludeResource: post
IncludeResource: post.comments Limit: (PerPage: 5, Offset: 1)
IncludeResource: post.comments.user
ExcludeResource: post.thumbnail

Example Setup 

```js
const ThreadTransformer = Transformer.create({
  availableIncludes: ['post'],

  transform (model) {

  },

  async includePost (model, params) {
    const post = await model.related('post')
      .limit(params.limit.perPage)
      .offset(params.limit.offset)
      .fetch()

    return {
      message: post.parsed_text
    }
  }
})
```




