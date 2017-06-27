window.onload = function()
{
	let container = document.getElementById("container");

	let ged = document.getElementById("glossary-entry-ex").innerHTML;

	for(let i = 0; i < PAGE_LIST.length; i++)
	{
		let entry = PAGE_LIST[i];
		if(entry[0] == "POST")
		{
			let entryName = entry[1];
			let entryPath = entry[2];

			let tempDiv = document.createElement("div");
			tempDiv.innerHTML = ged;

			let nd = undefined;
			for(let j = 0; j < tempDiv.childNodes.length; j++)
			{
				if(tempDiv.childNodes[j].className == "glossary-entry")
				{
					nd = tempDiv.childNodes[j];
					break;
				}
			}

			for(let j = 0; j < nd.childNodes.length; j++)
			{
				let child = nd.childNodes[j];
				if(child.className == "glossary-entry-title")
				{
					child.innerHTML = entryName;
					child.setAttribute("href", "{{PATH_ORIGIN}}/posts/" + entryPath);
				} else if(child.className == "glossary-entry-preview")
				{
					child.innerHTML = entry[4] + "...";
				} else if(child.className == "glossary-entry-date")
				{
					child.innerHTML = entry[3];
				}
			}

			container.appendChild(nd);
		}
	}
}
