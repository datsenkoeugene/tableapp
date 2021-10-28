import { data } from './data';
import Table from './table';
import '../css/style.css';

console.log(`%cInit App`, `color: lime;`);

const table = new Table(data, '#app');

table.render();
