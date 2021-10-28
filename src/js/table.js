export default class Table {

    constructor(data, selector) {
        this.page = 1;
        this.limit = 5;
        this.data = data;
        this.chunk();
        this.$element = document.querySelector(selector);
        this.init();
    }

    static selectRange() {
        return [5, 10, 25, 50, 100, 250];
    }

    chunk() {
        this.startIndex = (this.page - 1) * this.limit;
        this.endIndex = this.page * this.limit;
        this.renderData = this.data.slice(this.startIndex, this.endIndex);
    }

    init() {
        this.$element.addEventListener('click', this.sorting.bind(this));
        this.$element.addEventListener('click', this.paginate.bind(this));
        this.$element.addEventListener('change', this.changePageSize.bind(this));
    }

    table() {
        return `
            <div class="container">
                <h1 class="text-center mt-5">All rows (${this.data.length})</h1>
                ${this.createSelect()}
                <div class="table-responsive">
                    <table class="table table-bordered table-dark table-hover text-center">
                        ${this.createTHeader()}
                        ${this.createTbody()}
                    </table>
                </div>
                ${this.createButtons()}
            </div>
       `;
    }

    createTHeader() {
        this.headersTitle = Object.keys(this.data[0]);
        return `
            <thead>
                <tr>
                    ${this.headersTitle.map(title => 
                    `<th>
                        <div>
                            <span>${title.toUpperCase()}</span>
                            <div class="sorted">
                                <i class="fas fa-caret-up" data-name="${title}" data-sort="up"></i>
                                <i class="fas fa-caret-down" data-name="${title}" data-sort="down"></i>
                            </div>  
                        </div>
                    </th>`).join('')}                                                         
                </tr>
            </thead>
        `;
    }

    createTbody() {
        return `
            <tbody>
                ${this.renderData.map((item) => 
                    `<tr>                        
                         ${this.createTd(item)} 
                    </tr>`).join('')}
            </tbody>
        `;
    }

    createTd(item) {
        return this.headersTitle.map((_, index) =>
            `<td>${item[this.headersTitle[index]] ?? ''}</td>`).join('');
    }

    createPagination(dataTable, sizePage) {
        return Math.ceil(dataTable.length / sizePage);
    }


    createButtons() {
        let maxLeft = (this.page - Math.floor(this.limit / 2));
        let maxRight = (this.page + Math.floor(this.limit / 2));

        if (maxLeft < 1) {
            maxLeft = 1;
            maxRight = this.limit;
        }

        if (maxRight > this.createPagination(this.data, this.limit)) {
            maxLeft = this.createPagination(this.data, this.limit) - (this.limit - 1);

            if (maxLeft < 1) {
                maxLeft = 1;
            }
            maxRight = this.createPagination(this.data, this.limit);
        }

        let buttonsBlock = `<nav class="pagination-container"><ul class="pagination">`;

        for (let index = maxLeft; index <= maxRight; index++) {
            buttonsBlock +=
                `<li class="pagination-item">
                    <a class="pagination-link ${index === this.page ? 'active' : ''}" paginate href="#">
                        ${index}
                    </a>  
                </li>      
                `
        }
        return buttonsBlock + `</ul></nav>`;
    }

    sorting(event) {
        const { target } = event;

        if (target.dataset.sort === 'up' && this.headersTitle.includes(target.dataset.name)) {
            this.renderData = this.data
                .slice(this.startIndex, this.endIndex)
                .sort((a, b) => a[target.dataset.name] > b[target.dataset.name] ? -1 : 1);
            this.render();
        } else if (target.dataset.sort === 'down' && this.headersTitle.includes(target.dataset.name)) {
            this.renderData = this.data
                .slice(this.startIndex, this.endIndex)
                .sort((a, b) => a[target.dataset.name] < b[target.dataset.name] ? -1 : 1);
            this.render();
        }
    }

    paginate(event) {
        const { target } = event;

        if (target.matches('[paginate]')) {
            this.page = +target.textContent;
            this.$element
                .querySelectorAll('[paginate]')
                .forEach(btn => btn.classList.remove('active'));
            this.chunk();
            this.render();
        }
    }

    createSelect() {
        return `
            <select class="select">
                <option value="${this.limit}">${this.limit}</option>                
                ${Table.selectRange().map((item) => 
                    `<option class="select-option" value="${item}">${item}</option>`).join('')}
            </select>
        `
    }
    changePageSize(event) {
        this.limit = +event.target.value;
        this.page = 1
        this.chunk();
        this.render();
    }

    render() {
        this.$element.innerHTML = this.table();
    }
}
