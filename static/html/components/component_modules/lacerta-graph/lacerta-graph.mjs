let graph={createElements:function(t){var a=Math.min(500,500)/2;this.color=d3.scale.ordinal().range(["green","orange","blue","red"]),this.arc=d3.svg.arc().outerRadius(a-10).innerRadius(0),this.pie=d3.layout.pie().sort(null).value(function(t){return t.amount}),this.svg=d3.select(this.$.svg).attr("width",500).attr("height",500).append("g").attr("transform","translate(250,250)")},drawChart:function(t){var a=this;a.data.forEach(function(t){t.amount=+t.amount}),a.g=a.svg.selectAll(".arc").data(a.pie(a.data)).enter().append("g").attr("class","arc"),a.g.append("path").attr("d",a.arc).style("fill",function(t){return a.color(t.data.type)}),a.g.append("text").attr("transform",function(t){return"translate("+a.arc.centroid(t)+")"}).attr("dy",".35em").style("text-anchor","middle").text(function(t){return t.data.type})},refreshChart:function(t){var a=this;a.g.data(a.pie(a.data)).select("path").attr("d",a.arc),a.g.select("text").attr("transform",function(t){return"translate("+a.arc.centroid(t)+")"})},getData:function(t){var a=this;d3.csv(a.url,function(t,e){a.data=e,a.drawChart()})},domReady:function(t){this.createElements(),this.getData()},urlChanged:function(t){newValue&&oldValue&&this.getData()}};export default{graph:graph};