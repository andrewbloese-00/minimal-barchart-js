
/**
 * @typedef {
 *  dataset: number[][],
 *  title: string,
 *  axisTitles: { x: string, y: string }
 *  labels: string[],
 *  colors: string[],
 *  dims: string[],
 *  legend?:string[]
 * } BarChartProps
 * 
 * @typedef {{
 *  title: string,
 *  axisTitles?: {x?:string, y?:string}
 *  dataset: { [sampleName]: number[][]}
 *  colors: { [sampleName:string]:string},
 *  dims: string[], 
 *  legend: 
 * }} ScatterPlotProps
 *
 */




function buildXAxisChartLabels(labels,cols){
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

/**
 * 
 * @param {number[][]} dataset 
 * @param {string[]} colors 
 * @returns {HTMLDivElement} the container of the bar chart data view
 */
function buildBarChart(dataset, colors){
    const container = document.createElement("div");
    container.style.display = "grid";
    container.style.gridTemplateColumns = `repeat(${dataset[0].length},1fr)`;
    container.style.position = "relative";
    container.style.placeItems = "end";


    //compute max         
    const max = Math.max(...dataset.map(data=>Math.max(...data)))
    const barsize = val => (val / Math.ceil(max * 1.1)) * 100
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
            // const percent = (dataset[d][v] / max)*100
            datapoint.style.display = "flex"
            datapoint.style.backgroundColor = colors[d]
            datapoint.style.alignItems = "center";
            datapoint.style.justifyContent = "center"
            datapoint.style.width = "100%"
            datapoint.style.height = "0"
            datapoint.innerHTML = `<p>${dataset[d][v]}</p>`

            datapoint.style.transition = "all 300ms linear"
            setTimeout(()=>{
                datapoint.style.height = `${barsize(dataset[d][v])}%`;
            
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
    constructor(root, props){
        if(!props.dims) props.dims = ["300px","200px"]
        //init
        const xChartLabels = buildXAxisChartLabels(props.labels,props.dataset[0].length)
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

        //add axis titles if necessary
        if(props.axisTitles?.x){
            const xAxisTitle = document.createElement('span')
            xAxisTitle.style.position = "absolute"
            xAxisTitle.style.left = "50%"
            xAxisTitle.style.bottom = "-50px"
            xAxisTitle.textContent = props.axisTitles.x
            dataContainer.appendChild(xAxisTitle)
        }
        if(props.axisTitles?.y){
            const yAxisTitle = document.createElement('span')
            yAxisTitle.style.position = "absolute"
            yAxisTitle.style.left = "-36px"
            yAxisTitle.style.top = "50%"
            yAxisTitle.style.transform="rotate(-90deg)"
            yAxisTitle.textContent = props.axisTitles.y
            dataContainer.style.paddingLeft = "25px"
            dataContainer.appendChild(yAxisTitle)
            xChartLabels.style.paddingLeft = "25px"
        }


        title.textContent = props.title || ""
        props.title && chart.appendChild(title)


        //style
        chart.style.display = "grid"
        chart.style.width = props.dims[0]
        chart.style.height = props.dims[1] 
        
        //"combine" components
        chart.appendChild(dataContainer)
        chart.appendChild(xChartLabels)
        this.element = chart; 
        root.appendChild(chart)
    }
}


class MinimalScatterPlot { 
    constructor(root,props){

        //attach chart container
        const chart = document.createElement("section")
        chart.style.position = "relative"
        chart.style.marginTop = "4rem"
        chart.style.width = props.dims[0] || "300px"
        chart.style.height = props.dims[1] || "200px"
        chart.style.borderBottom = "1px solid black"
        chart.style.borderLeft= "1px solid black"
        root.appendChild(chart)
        this.element = chart;

        //determine max/min x & y
        let minX = Infinity, minY = Infinity
        let maxX = -Infinity, maxY = -Infinity; 
        for(let sampleName in props.dataset){
            for(let s = 0; s < props.dataset[sampleName].length; s++){
                const [x,y] = props.dataset[sampleName][s];
                minX = Math.min(minX,x);
                maxX = Math.max(maxX,x);
                minY = Math.min(minY,y);
                maxY = Math.max(maxY,y);


            }
        }


        maxY*= 1.2

        //use max and mins to determine transform
        const transformToChartPosition = ([x,y])=>{
            // Calculate the percentage position of x and y in the chart
            const xPerc= ((x - minX) / (maxX - minX)) 
            const yPerc = ((y - minY) / (maxY - minY)) 
            return [xPerc, yPerc];

        }
        //create points and add to container
        for(let sampleName in props.dataset){
            for(let s = 0; s < props.dataset[sampleName].length; s++){
                const sample = props.dataset[sampleName][s]
                const point = document.createElement("div")
                point.style.zIndex = "0"
                point.style.position = "absolute"
                point.style.height = "10px"
                point.style.width = "10px" 
                point.style.border = "2px solid black"
                const tooltip = document.createElement("div")
                tooltip.innerHTML = `<span><strong>${sampleName}</strong> (${sample[0]},${sample[1]})</span>`
                chart.appendChild(tooltip)
                point.style.overflow = "visible"

                //apply tooltip styles
                tooltip.style.display = "none"
                tooltip.style.background = props.colors[sampleName]
                tooltip.style.alignItems = "center"
                tooltip.style.justifyContent = "center"
                tooltip.style.width = "fit-content";
                tooltip.style.padding = "2px"
                tooltip.style.borderRadius = "4px"
                tooltip.style.color = "white"
                tooltip.style.zIndex = 50
                tooltip.style.position = "absolute"

                //show tooltip on point hover
                point.addEventListener("mouseenter",e=>{
                    tooltip.style.display = "flex"
                })
                point.addEventListener("mouseleave",e=>{
                    tooltip.style.display = "none"
                })


                point.style.backgroundColor = props.colors[sampleName]
                const [transformX,transformY] = transformToChartPosition(sample)
                const xPx = transformX*chart.clientWidth
                const yPx = transformY*chart.clientHeight
                point.style.left = 0
                point.style.bottom = 0
                point.style.transition = "all 0.3s ease"
                //animate points to their position
                setTimeout(()=>{
                    point.style.left = xPx + "px"
                    point.style.bottom = yPx + "px"
                },s*100)
                tooltip.style.left = (xPx + 10)+'px'
                tooltip.style.bottom = yPx + 'px'
                
                chart.appendChild(point)

            }

        }

        //add axis titles if necessary
        if(props.axisTitles?.x){
            const xAxisTitle = document.createElement('span')
            xAxisTitle.style.position = "absolute"
            xAxisTitle.style.left = "50%"
            xAxisTitle.style.bottom = "-25px"
            xAxisTitle.textContent = props.axisTitles.x
            xAxisTitle.style.width = "100%"
            chart.appendChild(xAxisTitle)
        }
        if(props.axisTitles?.y){
            const yAxisTitle = document.createElement('span')
            yAxisTitle.style.position = "absolute"
            yAxisTitle.style.left = "-36px"
            yAxisTitle.style.top = "50%"
            yAxisTitle.style.transform="rotate(-90deg)"
            yAxisTitle.textContent = props.axisTitles.y
            chart.style.paddingLeft = "25px"
            chart.appendChild(yAxisTitle)
            chart.style.paddingLeft = "25px"
            chart.style.marginLeft = "25px"
        }
        //create chart title (if specified)
        if(props.title){
            const title = document.createElement("span")
            title.style.position = "absolute"
            title.style.top = "-30px"
            title.style.left = "0"
            title.style.width = "100%"
            title.style.textAlign = "center"
            title.textContent = props.title
            chart.appendChild(title)
        }
        chart.style.overflow = "visible"

    }
}


//demo the chart 
function onLoad(){

    //Demo: Barchart 
    const barchart = new MinimalBarChart(document.body,{
        labels:  ["sun","mon","tue","wed","thu","fri","sat"],
        dataset: [ 
            [50,30,20,60,23,50,90],
            [40,52,33,26,30,25,99]
        ],
        colors: ["blue","lime"],
        legend: ["This Week", "Last Week"],
        dims: ["50%","300px"],
        title: "Example Barchart",
        axisTitles: { 
            y: "Earnings ($)",  
            x: ""
        }

    })
    

    barchart.element.style.fontFamily = "sans-serif"

    

    //Demo: Scatter Plot
    const scatterPlot = new MinimalScatterPlot(document.body,{
        dataset: {
            samples1: [[0,100],[1,80],[2,75],[3,65],[4,40],[5,40],[6,40]],
            samples2: [[0,100],[1,80],[2,75],[3,65],[4,40],[5,40],[6,40]].map(en=>en.reverse()),
            samples3: [[0,100],[1,80],[2,75],[3,65],[4,40],[5,40],[6,40]].map(en=>en.map(x=>x+5))
        },
        colors: {
            samples1: "violet",
            samples2: "orange",
            samples3: "royalblue"
        },
        title: "Example Scatter Plot",
        axisTitles: {
            x: "Time",
            y: "Energy"
        },
        dims: ["50%","300px"]
    })

    


}

document.addEventListener("DOMContentLoaded",onLoad)