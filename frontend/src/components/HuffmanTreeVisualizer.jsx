import { useEffect, useRef } from "react";
import * as d3 from "d3";

// eslint-disable-next-line react/prop-types
const HuffmanTreeVisualizer = ({ treeData }) => {
  const svgRef = useRef();

  useEffect(() => {
    const width = 1000;
    const height = 600;
    const margin = { top: 20, right: 90, bottom: 30, left: 90 };

    // Zoom and pan behavior
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
      .call(
        d3
          .zoom()
          .scaleExtent([0.5, 3])
          .on("zoom", (event) => {
            svgGroup.attr("transform", event.transform);
          })
      );

    // Clear any previous content from SVG
    svg.selectAll("*").remove();

    // Append a 'g' group to hold the tree,
    // we can use this for zoom/pan functionality
    const svgGroup = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // eslint-disable-next-line react/prop-types
    const root = d3.hierarchy(treeData.root, (d) =>
      d.left || d.right ? [d.left, d.right] : []
    );
    const treeLayout = d3
      .tree()
      .size([
        width - margin.right - margin.left,
        height - margin.top - margin.bottom,
      ]);

    const treeDataLayout = treeLayout(root);

    // for connection lines
    svgGroup
      .selectAll(".link")
      .data(treeDataLayout.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr(
        "d",
        d3
          .linkHorizontal()
          .x((d) => d.x)
          .y((d) => d.y)
      )
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 2);

    // for nodes
    const nodes = svgGroup
      .selectAll(".node")
      .data(treeDataLayout.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.x},${d.y})`);

    // for circle of nodes
    nodes
      .append("circle")
      .attr("r", (d) => Math.max(5, 15 - d.depth)) // radius will decrease with depth
      .attr("fill", "steelblue");

    // for node values (text and weights)
    nodes
      .append("text")
      .attr("dy", -15)
      .attr("text-anchor", "middle")
      .text((d) =>
        d.data.element ? `${d.data.element} (${d.data.weight})` : d.data.weight
      )
      .style("font-size", "10px")
      .style("fill", "white");
  }, [treeData]);

  return (
    <div className="mt-12 flex-col text-center">
      <h3 className="text-2xl text-white font-semibold">
        Huffman Tree created for your file 🌲
      </h3>
      <div className="relative flex justify-center">
        <svg
          ref={svgRef}
          className="mx-10 my-7 border-[1px] border-white rounded-xl"
        ></svg>
        <p className="text-white absolute md:right-48 md:top-10 lg:right-51">
          Scroll to zoom | Drag to pan
        </p>
      </div>
    </div>
  );
};

export default HuffmanTreeVisualizer;
