const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

//default blog posts on server load
BlogPosts.create('Can Tesla be Successful in the Semi Truck Market?', 'maybe', 'Jack Sparrow');
BlogPosts.create('How to Lose an Expenseive Pair of Sunglasses', 'be me', 'Tony Brancato');

router.get('/', (req, res) => {
	res.json(BlogPosts.get());
})

router.post('/', jsonParser, (req, res) => {
	//ensures that `title`, `content`, and `author`
	//are in the request body
	const requiredFields = ['title', 'content', 'author'];
	for (let i=0; i< requiredFields.length; i++) {
		const field = requiredFields[i];
		if(!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);			
		}
	}
	const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
	res.status(201).json(item);
})
router.delete('/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	console.log(`Deleted Blog Post ${req.params.id}) ${req.params.title}`);
	res.status(204).end();
});

router.put('/:id', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `missing ${field} in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}
	if (req.params.id !== req.body.id) {
    console.log('here');
    const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
    console.error(message);
    return res.status(400).send(message);		
	}
	console.log(`updating Blog Post item ${req.params.id}`);
		BlogPosts.update({
			id: req.params.id,
			title: req.body.title,
			content: req.body.content,
			author: req.body.author
		});
		res.status(204).end();
});

module.exports = router;