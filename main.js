function clickPageNum(pageNum) {
    populateProductSearchResults(pageNum);
}

var pdata;

function searchProducts() {
    var searchQuery = "";
    var nameValue = document.getElementById('name').value;
    var descriptionValue = document.getElementById('description').value;
    var categoryValue = document.getElementById('category').value;
    var priceValue = document.getElementById('price').value;
    var customfieldKey = document.getElementById('customfieldKey').value;
    var customfieldValue = document.getElementById('customfieldValue').value;
    var nameValue = document.getElementById('name').value;

    if(nameValue || descriptionValue || categoryValue || priceValue || (customfieldKey && customfieldValue)) {
        searchQuery += "?filter=";
        var andCondition = '';
        if(nameValue) {
            searchQuery += andCondition + 'name eq "' + nameValue + '"';
            andCondition = ' $and ';
        } 
        if(descriptionValue) {
            searchQuery += andCondition + 'description eq "' + descriptionValue + '"';
            andCondition = ' $and ';
        }
        if(categoryValue) {
            searchQuery += andCondition + 'category eq "' + categoryValue + '"';
            andCondition = ' $and ';
        }
        if(priceValue) {
            searchQuery += andCondition + 'price eq "' + priceValue + '"';
            andCondition = ' $and ';
        }
        if((customfieldKey && customfieldValue)) {
            searchQuery += andCondition + customfieldKey + ' eq "' + customfieldValue + '"';
            andCondition = ' $and ';
        }
        
    }
    var url = "http://localhost:8080/products";
    if(searchQuery) {
        searchQuery += '&pagenum=0&pagesize=100';
    } else {
        searchQuery += '?filter=none&pagenum=0&pagesize=100';
    }
    url += searchQuery;
    console.log(url);

    var ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open('GET',url,true);
    ajaxRequest.setRequestHeader('Access-Control-Allow-Origin', "*");
    ajaxRequest.setRequestHeader('Content-Type', "application/json");
    ajaxRequest.send();
    ajaxRequest.onload = function() 
    {
        if(this.status == 200) 
        {
            var productData = JSON.parse(this.responseText);
            pdata = productData;
            populateProductSearchResults(1);
            generatePoductSearchPageBar(url);
        } else {
            var productData = JSON.parse(this.responseText);
            pdata = productData;
            populateErrorMessage(url);
        }
    }
}

function generatePoductSearchPageBar(url) {
    if(pdata) {
        var ulWidth = 46 + (pdata.products.length/10 + 1)*50;
        var pageBar = '<ul style="width:'+ulWidth+'px; ">';
        var pages = pdata.products.length/10;
        console.log(pages);
        for(i = 1 ; i <= Math.ceil(pages) ; i++) {
            pageBar += '<li><input type="button" value="' + i + '" onclick="clickPageNum(' + i + ');"></input></li>' ;
        }

        pageBar += '&nbsp;Click on &nbsp;<- pages</ul>';

        document.getElementById('pagebar').innerHTML = pageBar;
    }
    
}
function populateErrorMessage(url)
{
    var output ='<div style= "float: left; width: 100%; border: groove; border-color: Green;">'+
                '<span style= "float: left; width: 100%;">'+pdata.message+'</span>';
    document.getElementById('productSearchResponse').innerHTML = output;
    var pageBar = '<ul style="width: 100px; "><li>No Pages To Display</li>';
    document.getElementById('pagebar').innerHTML = pageBar;
}

function populateProductSearchResults(page)
{  
    var output ='<div style= "float: left; width: 100%; border: groove; border-color: Green;">'+
                '<span style= "float: left; width: 2%;">ID</span>'+
                '<span style= "float: left; width: 15%;">NAME</span>'+
                '<span style= "float: left; width: 35%;">DESCRIPTION</span>'+
                '<span style= "float: left; width: 10%;">CATEGORY</span>'+
                '<span style= "float: left; width: 8%;">AVERAGE RATING</span>'+
                '<span style= "float: left; width: 20%;">IMAGE</span>'+
                '<span style= "float: left; width: 10%;">PRICE</span>'+
                '</div>';
    var dynamicPageLength = 10;
    if( (pdata.products.length - ((page-1)*10)) < 10  ) {
        dynamicPageLength = (pdata.products.length - ((page-1)*10));
    }
    for(i=((page-1)*10);i< (((page-1)*10) + dynamicPageLength) ;i++)
    {
        output +='<div style= "float: left; width: 100%; border: groove;">' +
                '<span style= "float: left; width: 2%;">'+ pdata.products[i].id + '</span>'+
                '<span style= "float: left; width: 15%;">'+ pdata.products[i].name + '</span>'+
                '<span style= "float: left; width: 35%;">'+ pdata.products[i].description + '</span>'+
                '<span style= "float: left; width: 10%;">'+ pdata.products[i].category + '</span>'+
                '<span style= "float: left; width: 8%;">'+ pdata.products[i].avgRating + '</span>'+
                '<span style= "float: left; width: 20%;">'+ pdata.products[i].imageLink + '</span>'+
                '<span style= "float: left; width: 10%;">$'+ pdata.products[i].price + '</span>'+
                '</div>';
    }
    document.getElementById('productSearchResponse').innerHTML = output;
}