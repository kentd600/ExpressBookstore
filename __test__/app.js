const test = require('supertest');
const assert = require('assert');
const app = require('../app');

const payloads = {
    a: {
        "isbn": 9780345391803,
        "amazon_url": "https://www.amazon.com/dp/0345391802",
        "author": "Douglas Adams",
        "language": "English",
        "pages": 224,
        "publisher": "Del Rey",
        "title": "The Hitchhiker's Guide to the Galaxy",
        "year": 1979
    },
    b: {
        "isbn": 9780062572233,
        "amazon_url": "https://www.amazon.com/dp/0062572233",
        "author": "Neil Gaiman",
        "language": "English",
        "pages": 465,
        "publisher": "William Morrow",
        "title": "American Gods",
        "year": 2001
    }
};

let foundErr = false;

const handleCatch = (err) => {
    console.error(err.message, '\n');
    foundErr = true;
};

console.log("Starting api test...\n");

(async () => {
    try {
        const payload = payloads.b;
        const res = await test(app)
        .post('/books')
        .send(payload)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(201)
        
        assert.deepStrictEqual(res.body, { book: {...payload, isbn: String(payload.isbn) }});

        console.log(res.text, '\nPost test 1 passed.\n')
    }
    catch (e) {
        handleCatch(e);
    }

    try {
        const payload = payloads.b
        const res = await test(app)
        .get('/books')
        .expect('Content-Type', /json/)
        .expect(200)

        const found = res.body.books.some(book => book.isbn === String(payload.isbn))

        assert.ok(found, 'Book not found in response.');
        console.log(res.text, '\nGet test passed.\n');
    }
    catch (e) {
        handleCatch(e);
    }

    try {
        const payload = payloads.a;
        const res = await test(app)
        .post('/books')
        .send(payload)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-type', /json/)
        .expect(201)
        
        assert.deepStrictEqual(res.body, { book: {...payload, isbn: String(payload.isbn) }});

        console.log(res.text, '\nPost test 2 passed.\n')
    }
    catch (e) {
        handleCatch(e);
    }

    try {
        const payload = payloads.a;
        const res = await test(app)
        .delete(`/books/${payload.isbn}`)
        .expect('Content-Type', /json/)
        .expect(200)

        console.log(res.text, '\nDelete test 1 passed.\n');
    }
    catch (e) {
        handleCatch(e);
    }

    try {
        const payload = {...payloads.b, pages: 500};
        const res = await test(app)
        .put(`/books/${payload.isbn}`)
        .send({ pages: 500 })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)

        assert.strictEqual(res.body.book.isbn, String(payload.isbn));
        assert.strictEqual(res.body.book.pages, payload.pages);
        console.log(res.text, '\nPut test passed.\n')
    }
    catch (e) {
        handleCatch(e);
    }

    try {
        const payload = payloads.b;
        const res = await test(app)
        .delete(`/books/${payload.isbn}`)
        .expect('Content-Type', /json/)
        .expect(200)

        console.log(res.text, '\nDelete test 2 passed.\n');
    }
    catch (e) {
        handleCatch(e);
    }

    if (foundErr) process.exit(1);
    process.exit(0);
})();