
/**
 * to update :
 * create a new card-container after every 12 cards.
 * the card-container will have display:none feature
 * every card-container will have only 4 rows, indexed : row-0, row-1, row-2, row-3
 * and 12 cards indexed card-0-0 ... card-1-3... card-2-6... card-3-9... card-3-11
 */

let cardNum = 0;
let rowNum = -1;
let pageNum = 0;

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
    let url = "https://kontests.net/api/v1/all";

    const request = new Request(url, {
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
    card.setAttribute("id", `card-${rowNum % 4}-${cardNum++ % 3}`);
    card.innerText=`==${cardNum-1} ${rowNum}==`;
    card.style.padding="5px";

    row.appendChild(card);

    return card;
}

let create_appendRow = (box) =>
{
    let cardRow = document.createElement("div");
    cardRow.setAttribute("class", "card-row");
    cardRow.setAttribute("id", `row-${++rowNum}`);
    cardRow.style.display="flex";
    cardRow.style.flexDirection="row";


    box.appendChild(cardRow);

    return cardRow;
}

let select_createRow = () => 
{
    let row;

    let box = document.getElementById("card-box")
    let rowList = box.getElementsByClassName("card-row");
    
    if(cardNum % 3 === 0 && cardNum/3 > rowNum % 4)
    {
        row = create_appendRow(box);
    }
    else
    {
        row = rowList[rowNum];
    }

    return row;
}

let run = async () => 
{
    const data = await recieveData();
    let card;
    let row;
    let page;

    for(i in data)
    {
        if(data[i].status === "CODING")
        {
            continue;
        }


        row = select_createRow();
        card = create_appendCard(data[i], row);

    }
}

// run();