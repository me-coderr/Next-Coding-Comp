
/**
 * to update :
 * create a new card-container after every 12 cards.
 * the card-container will have display:none feature
 * every card-container will have only 4 rows, indexed : row-0, row-1, row-2, row-3
 * and 12 cards indexed card-0-0 ... card-1-3... card-2-6... card-3-9... card-3-11
 */

let APIurl = "https://kontests.net/api/v1/all";

let cardNum = 0;
let rowNum = 0;
let pageNum = 0;
let count=0;

let replaceAlert = (text) => {
    return new Promise((resolve, reject) => {
        let div=document.createElement("div");
        div.setAttribute("class", "alert");
        div.innerHTML=`<p>${text}<p>`;
        document.body.appendChild(div);

        let okButton = document.createElement("button");
        okButton.setAttribute("type", "button");
        okButton.setAttribute("class", "okButton");
        okButton.innerText="Ok";
        div.appendChild(okButton);

        okButton.focus();

        okButton.addEventListener("click", (e) => {
            div.remove();
            resolve("Clicked ok button");
        });

        document.addEventListener("click", (e) => {
            div.remove();
            resolve("Clicked outside alert box");
        });
    });
};

let displayErrorMessage = async (err) => 
{
    let displayBox = document.getElementsByClassName("sectionName")[0];
    displayBox.innerText = `:(`;
    await replaceAlert(err);
}


let recieveData = async () =>
{
    let response;
    let data;

    const request = new Request(APIurl, {
        "method" : "GET"
    });

    try
    {  
        response = await fetch(request);
        if(response.ok != true || response.status < 200 || response.status > 299)
        {
            await displayErrorMessage("We are having some Server side issues. Sorry for the inconvinience.")
        }
        else
        {
            data = await response.json();
            return data;
        }
    }
    catch
    {
        await displayErrorMessage("We couldn't connect to the data sourcing site. Sorry for the inconvinience.")
    }
}

let create_appendCard = (dataObj, row) => 
{
    let card = document.createElement("div");
    card.setAttribute("class", "card");
    card.setAttribute("id", `card-${pageNum}-${rowNum}-${++cardNum}`);

    let imgContainer = document.createElement("div");
    imgContainer.setAttribute("class", "img-container")

    let img = document.createElement("img");
    img.setAttribute("src", "https://img.freepik.com/premium-vector/web-development-coding-programming-futuristic-banner-computer-code-laptop_3482-5582.jpg");
    img.setAttribute("class", "card-image");

    let name = document.createElement("div");
    name.setAttribute("class", "card-name");
    name.innerText=dataObj.name;

    let start = document.createElement("div");
    start.setAttribute("class", "start-time");
    start.innerHTML=`Date : ${dataObj.start_time.slice(0, 10)}<br>Time : ${dataObj.start_time.slice(11, 16)}`;

    let link = document.createElement("a");
    link.setAttribute("href", `${dataObj.url}`)

    let siteName = document.createElement("div");
    siteName.setAttribute("class", "siteName");
    siteName.innerText = `${dataObj.site}`;

    if()

    let button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("class", "goto-button");
    button.innerText = `${dataObj.site}`;

    link.appendChild(button);
    imgContainer.appendChild(img);

    card.appendChild(imgContainer);
    card.appendChild(name);
    card.appendChild(start);
    card.appendChild(siteName);
    card.appendChild(link);

    row.appendChild(card);

    return card;
}

let create_appendRow = (page) =>
{
    let cardRow = document.createElement("div");
    cardRow.setAttribute("class", "card-row");
    cardRow.setAttribute("id", `row-${pageNum}-${++rowNum}`);
    cardRow.style.display="flex";
    cardRow.style.flexDirection="row";

    page.appendChild(cardRow);

    return cardRow;
}

let select_createRow = (page) => 
{
    let row;
    let rowList = page.getElementsByClassName("card-row");
    
    if(cardNum === 3 || cardNum === 0)
    {
        cardNum = 0;
        row = create_appendRow(page);
    }
    else
    {
        row = rowList[rowNum-1];
    }

    return row;
}

let create_appendPage = (box) =>
{
    let page = document.createElement("div");
    page.setAttribute("class", "page");
    page.setAttribute("id", `page-${++pageNum}`);

    box.appendChild(page);

    return page;
}

let select_createPage = (box) =>
{
    let page;

    // if((cardNum === 2 && rowNum === 3) || (cardNum === 0 && rowNum === 0))
    if((rowNum === 0 && cardNum === 0) || (rowNum === 4 && cardNum === 3))
    {
        rowNum = 0;
        page = create_appendPage(box);
    }
    else
    {
        page = document.getElementById(`page-${pageNum}`);
    }

    return page;
}

let showPage = (atPage) =>
{
    let pages = document.getElementsByClassName("page");
    atPage -= 1;    // atPage = atPage - 1 , in order to match the index in object `pages`

    for( let i = 0; i < pages.length; i++)
    {
        if(i === atPage)
        {
            pages[i].style.display = "block";
        }
        else
        {
            pages[i].style.display = "none";
        }
    }
}

let setPage = (footer, atPage) =>
{
    let lastPageNum = Math.ceil(count/12);
    let pageNumBox = footer.children[1];

    if(lastPageNum === 1)
    {
        footer.style.visibility = "hidden";
        return;
    }

    if(atPage < 1)
    {
        return 1;
    }
    else if(atPage > lastPageNum)
    {
        return lastPageNum;
    }

    pageNumBox.innerText = `Page ${atPage}`;

    showPage(atPage);

    return atPage;
}

let execute_main = async () => 
{
    const data = await recieveData();
    let footer = document.getElementsByTagName("footer")[0];
    let box = document.getElementById("card-box");

    let atPage = 1;
    let card;
    let row;
    let page;

    for(i in data)
    {
        if(data[i].status === "CODING")
        {
            continue;
        }

        count++;

        page = select_createPage(box);
        row = select_createRow(page);
        card = create_appendCard(data[i], row);
    }

    setPage(footer, atPage);

    document.getElementById("pageBackward").addEventListener("click", (event) => 
    {
        let elem = event.target;
        atPage = setPage(footer, --atPage);
    });

    document.getElementById("pageForward").addEventListener("click", (event) => 
    {
        let elem = event.target;
        atPage = setPage(footer, ++atPage);
    });

    console.log(data[0])
}

execute_main();