let products = JSON.parse(localStorage.getItem('products')) || [];
let bids = JSON.parse(localStorage.getItem('bids')) || [];

const productNameInput = document.getElementById('product-name');
const basePriceInput = document.getElementById('base-price');
const addProductBtn = document.getElementById('add-product-btn');
const biddingTableBody = document.getElementById('bidding-table-body');
const bidProductNameInput = document.getElementById('bid-product-name');
const bidAmountInput = document.getElementById('bid-amount');
const placeBidBtn = document.getElementById('place-bid-btn');
const declareWinnerBtn = document.getElementById('declare-winner-btn');
const winnerAnnouncement = document.getElementById('winner-announcement');

addProductBtn.addEventListener('click', function() {
    const productName = productNameInput.value;
    const basePrice = Number(basePriceInput.value);

    if (productName === '') {
        alert('Please enter a product name');
        return;
    }
    if (isNaN(basePrice) || basePrice <= 0) {
        alert('Please enter a valid base price');
        return;
    }

    const product = { productName, basePrice };
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
    renderProducts();
    clearProductInputs();
});

placeBidBtn.addEventListener('click', function() {
    const productName = bidProductNameInput.value;
    const bidAmount = Number(bidAmountInput.value);

    if (productName === '') {
        alert('Please enter a product name');
        return;
    }
    if (isNaN(bidAmount) || bidAmount <= 0) {
        alert('Please enter a valid bid amount');
        return;
    }

    const bid = { productName, bidAmount };
    bids.push(bid);
    localStorage.setItem('bids', JSON.stringify(bids));
    clearBidInputs();
});

declareWinnerBtn.addEventListener('click', function() {
    const winners = calculateWinners();
    if (winners.length > 0) {
        winnerAnnouncement.textContent = `Winners: ${winners.map(w => `${w.productName} - $${w.bidAmount}`).join(', ')}`;
    } else {
        winnerAnnouncement.textContent = 'No unique lowest bid found';
    }
});

function renderProducts() {
    biddingTableBody.innerHTML = '';
    products.forEach((product, index) => {
        const newRow = biddingTableBody.insertRow();
        
        const productNameCell = newRow.insertCell();
        const basePriceCell = newRow.insertCell();
        const bidCell = newRow.insertCell();

        productNameCell.textContent = product.productName;
        basePriceCell.textContent = product.basePrice.toFixed(2);

        bidCell.textContent = bids.filter(bid => bid.productName === product.productName).map(bid => bid.bidAmount).join(', ');
    });
}

function clearProductInputs() {
    productNameInput.value = '';
    basePriceInput.value = '';
}

function clearBidInputs() {
    bidProductNameInput.value = '';
    bidAmountInput.value = '';
}

function calculateWinners() {
    const winners = [];
    products.forEach(product => {
        const productBids = bids.filter(bid => bid.productName === product.productName);
        const bidCounts = {};
        productBids.forEach(bid => {
            if (bidCounts[bid.bidAmount]) {
                bidCounts[bid.bidAmount]++;
            } else {
                bidCounts[bid.bidAmount] = 1;
            }
        });
        const uniqueBids = productBids.filter(bid => bidCounts[bid.bidAmount] === 1);
        if (uniqueBids.length > 0) {
            const lowestUniqueBid = uniqueBids.reduce((min, bid) => bid.bidAmount < min.bidAmount ? bid : min);
            winners.push(lowestUniqueBid);
        }
    });
    return winners;
}

// Initially render any existing products and bids
renderProducts();
