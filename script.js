
/**
 * to update :
 * Filters:
 * By default, no filters are applied
 * When a filter type is selected, the filter selected is shown on the applied filter box
 * the cards of previous filters are shifted and new filter cards are shown in the beginning(if filters are already selected, if no filters are selected 
 * then all the previous cards will be hidden and only the new cards will be visible.
 */

let APIurl = "https://kontests.net/api/v1/all";

let cardNum;
let rowNum;
let pageNum;
let count;

let replaceAlert = (text) => {
    return new Promise((resolve, reject) => {
        // let alertContainer = document.createElement("div");
        // alertContainer.setAttribute("class", "alertContainer");

        let alertBox=document.createElement("div");
        alertBox.setAttribute("class", "alert");
        alertBox.innerHTML=`<p>${text}<p>`;

        let okButton = document.createElement("button");
        okButton.setAttribute("type", "button");
        okButton.setAttribute("class", "okButton");
        okButton.innerText="Ok";

        alertBox.appendChild(okButton);
        // alertContainer.appendChild(alertBox);
        document.getElementsByTagName("body")[0].appendChild(alertBox);

        okButton.focus();

        okButton.addEventListener("click", (e) => {
            alertBox.remove();
            // alertContainer.remove();
            resolve("Clicked ok button");
        });

        // alertContainer.addEventListener("click", (e) => {
        document.addEventListener("click", (e) => {
            alertBox.remove();
            // alertContainer.remove();
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

let create_appendCard = (dataObj, row, filterClicked) => 
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
    start.setAttribute("class", "start");
    start.innerHTML=`Date : ${dataObj.start_time.slice(0, 10)}<br>Time : ${dataObj.start_time.slice(11, 16)}`;

    let siteName = document.createElement("div");
    siteName.setAttribute("class", "siteName");
    siteName.innerText = `${dataObj.site}`;

    let linkButton = document.createElement("a");
    linkButton.setAttribute("href", `${dataObj.url}`);
    linkButton.setAttribute("target", `_blank`);
    linkButton.setAttribute("rel", `noopener noreferrer`);

    let button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("class", "goto-button");
    button.innerText = `Register Here →`;

    linkButton.appendChild(button);
    imgContainer.appendChild(img);

    card.appendChild(imgContainer);
    card.appendChild(name);
    card.appendChild(start);
    card.appendChild(siteName);
    card.appendChild(linkButton);

    row.appendChild(card);

    let site = dataObj.site;;


    if(site == undefined)
    {
        site = filterClicked.id;
        switch(site)
        {
            case "codeforces" : 
                card.style.backgroundColor = "lightgray";
                siteName.innerText = "CodeForces"
                break;

            case "codeforces_gym" : 
                card.style.backgroundColor = "paleblue";
                siteName.innerText = "CodeForces::Gym"
                break;

            case "top_coder" : 
                card.style.backgroundColor = "beige";
                siteName.innerText = "TopCoder"
                break;

            case "at_coder" : 
                card.style.backgroundColor = "lightyellow";
                siteName.innerText = "AtCoder"
                break;

            case "cs_academy" : 
                card.style.backgroundColor = "lightpink";
                siteName.innerText = "CS Academy"
                break;

            case "code_chef" : 
                card.style.backgroundColor = "lightcoral";
                siteName.innerText = "CodeChef"
                break;

            case "hacker_rank" : 
                card.style.backgroundColor = "lavender";
                siteName.innerText = "HackerRank"
                break;

            case "hacker_earth" : 
                card.style.backgroundColor = "palegreen";
                siteName.innerText = "HackerEarth"
                break;

            case "leet_code" : 
                card.style.backgroundColor = "lightskyblue";
                siteName.innerText = "LeetCode"
                break;
        }
        
    }
    else
    {
        switch(site)
        {
            
            case "CodeForces" : 
                card.style.backgroundColor = "lightgray";
                break;

            case "CodeForces::Gym" : 
                card.style.backgroundColor = "paleblue";
                break;

            case "CodeForces" : 
                card.style.backgroundColor = "mintgreen";
                break;

            case "TopCoder" : 
                card.style.backgroundColor = "beige";
                break;

            case "AtCoder" : 
                card.style.backgroundColor = "lightyellow";
                break;

            case "CS Academy" : 
                card.style.backgroundColor = "lightpink";
                break;

            case "CodeChef" : 
                card.style.backgroundColor = "lightcoral";
                break;

            case "HackerRank" : 
                card.style.backgroundColor = "lavender";
                break;

            case "HackerEarth" : 
                card.style.backgroundColor = "palegreen";
                break;

            case "LeetCode" : 
                card.style.backgroundColor = "lightskyblue";
                break;
            
            case "Toph" : 
                card.style.backgroundColor = "softpeach";
                break;
        }
    }
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
    if((rowNum === 0 && cardNum === 0) || (rowNum === 3 && cardNum === 3))
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

    if(lastPageNum <= 1)
    {
        return;
    }

    footer.style.visibility = "visible";

    // if(atPage < 1)                 // gives circular scrolling effect
    // {
    //     atPage = lastPageNum;
    // }
    // else if(atPage > lastPageNum)
    // {
    //     atPage = 1;
    // }
    
    if(atPage < 1)              // prevents page backward turn when at first page
    {                           // prevents page forward turn when at last page
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

function removeFilter(event)
{
    filter = event.target.parentElement;

    if(filter.parentElement.children.length === 1)
    {
        filter.parentElement.getElementsByTagName("button")[0].remove();
        filter.parentElement.getElementsByTagName("p")[0].innerText = "None";
    }
    else
    {
        filter.remove();
    }
}

function filterClickHandler(event)
{
    let filtersBox = document.getElementsByClassName("filtersBox")[0];
    let selectedFilterName = event.target.getAttribute("name");
    let appliedFilters = filtersBox.children;
    let filterAlreadyApplied = false;

    if(appliedFilters.length === 1 && appliedFilters[0].getElementsByTagName("p")[0].innerText == "None")
    {
        appliedFilters[0].remove();
    }
    else
    {
        Array.from(appliedFilters).forEach((filter) =>
        {
            if(filter.children[0].innerText == selectedFilterName)
            {
                filterAlreadyApplied = true;
            }
        });
    }

    if(filterAlreadyApplied)
    {
        return;
    }
    
    let selectedFilter = document.createElement("div");
    selectedFilter.setAttribute("class", "filter");

    let text = document.createElement("p");
    text.innerText = `${selectedFilterName}`;

    let cancel = document.createElement("button");
    cancel.setAttribute("class", "cancelFilter");
    cancel.innerText = "×";

    filtersBox.appendChild(selectedFilter);
    selectedFilter.appendChild(text);
    selectedFilter.appendChild(cancel);

    cancel.addEventListener("click", removeFilter);

    APIurl = `https://kontests.net/api/v1/${event.target.id}`;    
    execute_main(event.target);
}

let applyFilters = () =>
{
    let availableFilters = document.getElementsByClassName("filterType");

    Array.from(availableFilters).forEach((filter) => 
    {
        filter.addEventListener("click", filterClickHandler);

        filter.addEventListener("dblclick", (event) => 
        {
            event.target.removeEventListener("click", filterClickHandler);
            setTimeout(() =>
            {
                event.target.addEventListener("click", filterClickHandler);
            }, 1000);
        });
    });
}

let hideAll = () =>
{
    let cardPages = document.getElementsByClassName("page");

    Array.from(cardPages).forEach((page) =>
    {
        page.remove();
    });
}

let execute_main = async (filterClicked) => 
{
    let footer = document.getElementsByTagName("footer")[0];
    let box = document.getElementById("card-box");

    cardNum=0;
    rowNum=0;
    pageNum=0;
    count=0;

    // hideAll();

    const data = await recieveData();

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
        card = create_appendCard(data[i], row, filterClicked);
    }

    if(count === 0)
    {
        await replaceAlert("For the time-being, there are no contests under the category : <br>" + filterClicked.getAttribute("name"));

        filters = document.getElementsByClassName("filter");

        if(filters.length === 1)
        {
            filters[0].getElementsByTagName("p")[0].innerText = "None";
            filters[0].getElementsByTagName("button")[0].remove();
        }
        else
        {
            let lastFilter = filters[filters.length -1];
            lastFilter.remove();
        }

        setPage(footer, atPage);

        return;
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

    applyFilters();
}

execute_main();