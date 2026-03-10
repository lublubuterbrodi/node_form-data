'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

function createServer() {
  return http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/add-expense') {
      let body = '';

      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', () => {
        let expense;

        try {
          expense = JSON.parse(body);
        } catch (error) {
          res.writeHead(400, {
            'Content-Type': 'text/plain',
          });
          res.end('Invalid JSON');

          return;
        }

        const { date, title, amount } = expense;

        if (!date || !title || !amount) {
          res.writeHead(400, {
            'Content-Type': 'text/plain',
          });
          res.end('Missing required fields');

          return;
        }

        const filePath = path.resolve(__dirname, '../db/expense.json');

        fs.writeFileSync(
          filePath,
          JSON.stringify({
            date,
            title,
            amount,
          }),
        );

        res.writeHead(200, {
          'Content-Type': 'application/json',
        });

        res.end(
          JSON.stringify({
            date,
            title,
            amount,
          }),
        );
      });

      return;
    }

    res.writeHead(404, {
      'Content-Type': 'text/plain',
    });
    res.end('Page not found');
  });
}

module.exports = {
  createServer,
};
