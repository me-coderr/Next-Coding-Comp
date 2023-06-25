
/**
 * 
 */

let APIurl = "https://kontests.net/api/v1/all";

let cardNum;
let atPage;

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
}

let displayErrorMessage = async (err) => 
{
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
            await displayErrorMessage(`We are having some Server side issues. Sorry for the inconvinience. Status code : ${response.status}`)
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

let create_appendCard = (dataObj, cardContainer) =>
{
    let card = document.createElement("div");
    card.setAttribute("class", "card");
    card.setAttribute("id", `card-${++cardNum}`);
    card.setAttribute("data-toShow", "Yes");

    let imgContainer = document.createElement("div");
    imgContainer.setAttribute("class", "img-container");

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

    let in24hrs = document.createElement("p");
    in24hrs.setAttribute("class", "in24hrs?");
    in24hrs.innerText = `${dataObj.in_24_hours}`;
    in24hrs.style.display = "none";

    linkButton.appendChild(button);
    imgContainer.appendChild(img);

    card.appendChild(imgContainer);
    card.appendChild(name);
    card.appendChild(start);
    card.appendChild(siteName);
    card.appendChild(linkButton);
    card.appendChild(in24hrs);

    cardContainer.appendChild(card);

    let site = dataObj.site;;

    switch(site)
    {
        
        case "CodeForces" : 
            card.style.backgroundColor = "lightgray";
            break;

        case "CodeForces::Gym" : 
            card.style.backgroundColor = "aquamarine";
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
    };
    
    return card;
}

let showPage = (atPage, cards) =>
{
    let allCards = document.getElementsByClassName("card");

    let startingCardNum = (atPage - 1)*9 + 1;
    let endingCardNum = atPage*9;

    Array.from(cards).forEach((card) =>
    {
        card.setAttribute("data-toShow", "Yes");
    });

    Array.from(allCards).forEach((card) =>
    {
        card.style.display = "none";
    });

    for(let i = startingCardNum-1; i<endingCardNum && i<cards.length; i++)
    {
        let card = cards[i];
        card.style.display = "flex";
    }
}

let setPage = (footer, atPage, cardsData) =>
{
    let lastPageNum = Math.ceil(cardsData.length/9);
    let pageNumBox = footer.children[1];

    if(lastPageNum <= 1)
    {
        footer.style.visibility = "hidden";
        showPage(atPage, cardsData);
        return;
    }

    footer.style.visibility = "visible";
    
    if(atPage < 1)              // prevents page backward turn when at first page
    {                           // prevents page forward turn when at last page
        return 1;
    }
    else if(atPage > lastPageNum)
    {
        return lastPageNum;
    }

    pageNumBox.innerText = `Page ${atPage}`;

    showPage(atPage, cardsData);

    return atPage;
}

function removeFilter(event)
{
    let filterToRemove = event.target.parentElement;
    let filterBox = filterToRemove.parentElement;
    let filters = filterBox.children;
    let filterToRemoveName = filterToRemove.getElementsByTagName("p")[0].innerText;
    let cardsToShow = [];

    let allCards = Array.from(document.getElementsByClassName("card"));

    filterToRemove.remove();
    
    if(filters.length === 0)
    {
        let none = document.createElement("div");
        none.setAttribute("class", "filter");
        
        let text = document.createElement("p");
        text.innerText = "None";
        
        none.appendChild(text);
        filterBox.appendChild(none);
    }

    let selectedCards = allCards.filter((card) =>
    {
        return card.getAttribute("data-toShow") === "Yes";
    });

    allCards.forEach((card) =>
    {
        card.setAttribute("data-toShow", "No");
    });
    
    if(filters.length === 1 && filters[0].getElementsByTagName("p")[0].innerText === "None")
    {
        cardsToShow = allCards;
    }
    else
    {
        if(filterToRemoveName === "Within 24 hours")
        {
            Array.from(filters).forEach((filter) =>
            {
                let selectedFilterName = filter.getElementsByTagName("p")[0].innerText;

                let temp = allCards.filter((card) =>
                {
                    return card.getElementsByClassName("siteName")[0].innerText === selectedFilterName;
                });

                cardsToShow = cardsToShow.concat(temp);
            });
        }
        else
        {
            cardsToShow = selectedCards.filter((card) =>
            {
                return !(card.getElementsByClassName("siteName")[0].innerText === filterToRemoveName);
            });
        }
    }

    atPage = 1;
    setPage(document.getElementsByTagName("footer")[0], atPage, cardsToShow);
}

async function filterClickHandler(event)
{
    let filterBox = document.querySelector(".filtersBox");
    let selectedFilterName = event.target.getAttribute("name");
    let appliedFilters = filterBox.children;
    let filterAlreadyApplied = false;

    if(appliedFilters.length === 1 && appliedFilters[0].getElementsByTagName("p")[0].innerText == "None")
    {
        appliedFilters[0].remove();
    }
    else
    {
        Array.from(appliedFilters).forEach((filter) =>
        {
            if(filter.getElementsByTagName("p")[0].innerText == selectedFilterName)
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

    filterBox.appendChild(selectedFilter);
    selectedFilter.appendChild(text);
    selectedFilter.appendChild(cancel);

    cancel.addEventListener("click", removeFilter);             // added eventlistener to cancel filter button.

    let allCards = document.getElementsByClassName("card");

    let cards = Array.from(allCards).filter((card) =>
    {
        return card.getAttribute("data-toShow") === "Yes";
    });

    Array.from(allCards).forEach((card) =>
    {
        card.setAttribute("data-toShow", "No");
    });

    let filteredCards;

    if(selectedFilterName == "Within 24 hours")
    {
        filteredCards = Array.from(cards).filter((card) =>
        {
            return card.getElementsByClassName("in24hrs?")[0].innerText === "Yes";
        });

        if(filteredCards.length === 0)
        {
            await replaceAlert("Sorry but there are no competitions happening within the next 24 hours.");
        }
    }
    else
    {
        allCards = Array.from(allCards);
        filteredCards = [];

        Array.from([...appliedFilters]).reverse().forEach((filter) =>
        {
            selectedFilterName = filter.getElementsByTagName("p")[0].innerText;

            let temp = allCards.filter((card) =>
            {
                return card.getElementsByClassName("siteName")[0].innerText === selectedFilterName;
            });

            filteredCards = filteredCards.concat(temp);
        });
        
        if(filteredCards.length === 0)
        {
            await replaceAlert("Sorry but there are no competitions happening under this category set.");
        }
        else
        {
            let within24AlreadyApplied = false;

            Array.from(appliedFilters).forEach((filter) =>
            {
                if(filter.getElementsByTagName("p")[0].innerText === "Within 24 hours")
                {
                    within24AlreadyApplied = true;
                }
            });

            if(within24AlreadyApplied === true)
            {
                let filteredFromFilteredCards = Array.from(filteredCards).filter((card) =>
                {
                    return card.getElementsByClassName("in24hrs?")[0].innerText === "Yes";
                });

                if(filteredFromFilteredCards.length === 0)
                {
                    await replaceAlert("Sorry but there are no competitions happening within the next 24 hours under this category.");
                }
                else
                {
                    filteredCards = filteredFromFilteredCards;
                }
            }
        }
    }
    atPage = 1;
    setPage(document.getElementsByTagName("footer")[0], atPage, filteredCards);
}

let applyFilters = () =>
{
    let availableFilters = document.querySelectorAll(".filterType");

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

let execute_main = async () => 
{
    let data = await recieveData();

    const finalData = Array.from(data).filter((dataObj) =>
    {
        return dataObj.status === "BEFORE";
    });

    let footer = document.getElementsByTagName("footer")[0];
    let box = document.getElementById("card-box");

    cardNum=0;
    atPage = 1;

    finalData.forEach((dataObj) =>
    {
        create_appendCard(dataObj, box);
    });

    let allCards = document.getElementsByClassName("card");

    applyFilters(finalData);

    setPage(footer, atPage, allCards);

    document.getElementById("pageBackward").addEventListener("click", (event) => 
    {
        let data = Array.from(allCards).filter((card) =>
        {
            return card.getAttribute("data-toShow") === "Yes";
        });

        atPage = setPage(footer, --atPage, data);
    });

    document.getElementById("pageForward").addEventListener("click", (event) => 
    {
        let data = Array.from(allCards).filter((card) =>
        {
            return card.getAttribute("data-toShow") === "Yes";
        });

        atPage = setPage(footer, ++atPage, data);
    });
}

execute_main();