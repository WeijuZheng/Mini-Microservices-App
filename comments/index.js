const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    const { id: postId } = req.params;
    res.send(commentsByPostId[postId] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;
    const { id: postId } = req.params;

    const comments = commentsByPostId[postId] || [];

    comments.push({ id: commentId, content, status: 'pending' });
    commentsByPostId[postId] = comments;

    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content: content,
            status: 'pending',
            postId: postId
        }
    });

    res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
    console.log('Event Received', req.body.type);
    const { type, data } = req.body;

    if (type === 'CommentModerated') {
        const { postId, id, status, content } = data;
        const comments = commentsByPostId[postId];
        const comment = comments.find(comment => {
            return comment.id === id;
        });

        // same object in the array, same memory
        // not needed to insert back to the array
        comment.status = status;

        await axios.post('http://localhost:4005/events', {
            type: 'CommentUpdated',
            data: {
                id,
                postId,
                status,
                content
            }
        });
    }
    res.send({});
});

app.listen(4001, () => {
    console.log('SERVING ON PORT 4001');
});