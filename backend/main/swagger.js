import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'My API',
    description: 'API documentation',
  },
  host: 'localhost:3000',
  schemes: ['http'],
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./routes/*.js'];  // path to your route files

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./app.js'); // Your main server file
});
