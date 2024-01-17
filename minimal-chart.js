
/**
 * @typedef {
 *  dataset: number[][],
 *  labels: string[],
 *  colors: string[],
 *  dimsPx: number[],
 *  title: string,
 *  legend?:string[]
 * } BarChartProps
 */

function buildXAxisLabels(labels,cols){
    const xContainer = document.createElement("div")
    xContainer.className="xlabels";
    xContainer.style.display = "grid";
    xContainer.style.width = "100%";
    xContainer.style.gridTemplateColumns = `repeat(${cols},1fr)`;
    xContainer.style.placeItems = "center";
    //generate labels
    let xAxisMarkup = ""
    for(let i = 0; i < labels.length; i++){
        xAxisMarkup += `<span style=" height:20px; width:100%; text-align: center;">${labels[i]}</span>`
    }
    xContainer.innerHTML = xAxisMarkup;
    xContainer.style.height = "40px";
    return xContainer;

}

function buildBarChart(dataset, colors){
    const container = document.createElement("div");
    container.style.display = "grid";
    container.style.gridTemplateColumns = `repeat(${dataset[0].length},1fr)`;
    container.style.position = "relative";
    container.style.placeItems = "end";

    //compute max         
    const max = Math.max(...dataset.map(data=>Math.max(...data)))
    let n = 0; 
    for(let v = 0; v < dataset[0].length;v++){
        const wrapper = document.createElement('div')
        wrapper.style.height = "100%"
        wrapper.style.gridTemplateColumns = `repeat(${dataset.length},1fr)`
        wrapper.style.display = "grid"
        wrapper.style.width = "100%"
        wrapper.style.placeItems = "end"
        if(v%2 == 0 ){
            wrapper.style.borderLeft =  "1px dashed #333"
            wrapper.style.borderRight =  "1px dashed #333"

        }
        for(let d = 0; d < dataset.length; d++){
            const datapoint = document.createElement('div')
            const percent = (dataset[d][v] / max)*100
            datapoint.style.display = "flex"
            datapoint.style.backgroundColor = colors[d]
            datapoint.style.alignItems = "center";
            datapoint.style.justifyContent = "center"
            datapoint.style.width = "100%"
            datapoint.style.height = "0"
            datapoint.innerHTML = `<p>${dataset[d][v]}</p>`

            datapoint.style.transition = "all 300ms linear"
            setTimeout(()=>{
                datapoint.style.height = `${percent}%`;
            
            },n*50)

            const label = datapoint.querySelector("p")
            label.style.opacity = 0
            label.style.color = colors[d]
            label.style.transition = "all 300ms ease"
            
            

            datapoint.addEventListener("mouseenter", ()=>{
                label.style.color = "#fff";
                label.style.opacity = 1;
                document.querySelector(".xlabels").children[v].style.backgroundColor = "aliceblue"

                
            })
            datapoint.addEventListener("mouseleave", () => {
                label.style.color = colors[d];
                document.querySelector(".xlabels").children[v].style.backgroundColor = "transparent"

            })
            wrapper.append(datapoint)
            n++
        }
        container.appendChild(wrapper)
    }
    return container
}



//a bar chart that builds based on provided dataset(s), colors and title. Animates data on creation
class MinimalBarChart { 
    /**
     * 
     * @param {BarChartProps} props 
     */
    constructor(props){
    
        if(!props.dimsPx) props.dimsPx = [500,300]
        //init
        const xLabels = buildXAxisLabels(props.labels,props.dataset[0].length)
        const dataContainer = buildBarChart(props.dataset,props.colors);
        const chart = document.createElement("section");
        const title = document.createElement("span")
        chart.style.position = "relative"
        chart.style.marginTop= "4rem"
        title.style.position = "absolute"
        title.style.top = "-30px"
        title.style.left = "0"
        title.style.width = "100%"
        title.style.textAlign = "center"

        title.textContent = props.title || "Untitled"
        chart.appendChild(title)


        //style
        chart.style.display = "grid"
        chart.style.width = props.dimsPx[0]+"px"
        chart.style.height = props.dimsPx[1] +"px"
        
        //combine components
        chart.appendChild(dataContainer)
        chart.appendChild(xLabels)
        this.element = chart; 

    }
}


//demo the chart 
function onLoad(){
    const labels = ["sun","mon","tue","wed","thu","fri","sat"]
    const dataset = [ 
        [50,30,20,60,23,50,90],
        [40,52,33,26,30,25,100]
    ]

    const mychart = new MinimalBarChart({
        // dataset: [[1,2,3],[2,1,3],[4,1,5],[2,3,1]],
        // labels:  ["sun","mon","tue"],
        labels, dataset,
        colors: ["blue","lime"],
        dimsPx: [600,400],
        title: "My Chart"
    })
    

    mychart.element.style.fontFamily = "sans-serif"
    document.body.appendChild(mychart.element)
}

document.addEventListener("DOMContentLoaded",onLoad)