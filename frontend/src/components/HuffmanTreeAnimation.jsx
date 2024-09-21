import { useState, useEffect } from "react";
import * as d3 from "d3";
import PropTypes from "prop-types";

const HuffmanTreeAnimation = ({ data }) => {
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Set up steps for building the Huffman Tree
  useEffect(() => {
    const initialNodes = data.map((d, index) => ({
      ...d,
      id: d.element || `node${index}`,
      isLeaf: true,
    }));

    const heap = [...initialNodes];
    const mergeSteps = [];
    mergeSteps.push([...heap]);

    while (heap.length > 1) {
      heap.sort((a, b) => a.weight - b.weight);

      const left = heap.shift();
      const right = heap.shift();

      mergeSteps.push([...heap, left, right]);

      const newNode = {
        id: `${left.id}-${right.id}`,
        weight: left.weight + right.weight,
        left,
        right,
        isLeaf: false,
      };

      heap.push(newNode);
      mergeSteps.push([...heap]);
    }

    setSteps(mergeSteps);
  }, [data]);

  // Render tree on current step
  useEffect(() => {
    if (steps.length === 0 || currentStep >= steps.length) return;

    // Clear the previous tree before rendering the new one
    const svg = d3.select("#huffmanTree");
    svg.selectAll("*").remove();

    const svgGroup = svg
      .attr("viewBox", [-40, -30, 500, 350])
      .call(
        d3.zoom().on("zoom", (event) => {
          svgGroup.attr("transform", event.transform);
        })
      )
      .append("g");

    const height = 350;
    const topPadding = 40;
    const subtreeSpacing = 100; // reduced subtree spacing

    const currentNodes = steps[currentStep];

    // Build the hierarchy for all non-leaf nodes (subtrees)
    const buildHierarchy = (node) => {
      if (!node.left && !node.right) {
        return {
          id: node.id,
          weight: node.weight,
          element: node.element,
          isLeaf: node.isLeaf,
          children: [],
        };
      }
      return {
        id: node.id,
        weight: node.weight,
        children: [buildHierarchy(node.left), buildHierarchy(node.right)],
      };
    };

    // Filter leaf nodes and subtrees
    const poolNodes = currentNodes.filter((node) => node.isLeaf);
    const treeNodes = currentNodes.filter((node) => !node.isLeaf);

    // Create separate root for each subtree
    const subTrees = treeNodes.map((node) =>
      d3.hierarchy(buildHierarchy(node)).sum((d) => d.weight)
    );

    const treeLayout = d3.tree().nodeSize([35, 75]); // reduced node size

    // Draw each subtree
    subTrees.forEach((root, i) => {
      const xOffset = (i % 4) * subtreeSpacing + 75; // reduced xOffset
      const yOffset = Math.floor(i / 4) * (height / 4);

      const treeData = treeLayout(root);

      // each node and line has different class for identification

      // for connecting lines
      svgGroup
        .selectAll(`.link-tree-${i}`)
        .data(treeData.links())
        .enter()
        .append("line")
        .attr("class", `link-tree-${i}`)
        .attr("x1", (d) => d.source.x + xOffset)
        .attr("y1", (d) => d.source.y + yOffset + topPadding)
        .attr("x2", (d) => d.target.x + xOffset)
        .attr("y2", (d) => d.target.y + yOffset + topPadding)
        .attr("stroke", "white")
        .attr("stroke-width", 1); // reduced stroke width

      // for nodes in tree
      svgGroup
        .selectAll(`.node-tree-${i}`)
        .data(treeData.descendants())
        .enter()
        .append("g")
        .attr("class", `node-tree-${i}`)
        .attr(
          "transform",
          (d) => `translate(${d.x + xOffset},${d.y + yOffset + topPadding})`
        )
        .append("circle")
        .attr("r", 10) // reduced circle radius
        .attr("fill", "lightgreen");

      svgGroup
        .selectAll(`.node-tree-${i}`)
        .append("text")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .style("font-size", "10px") // reduced font size
        .text((d) =>
          d.data.element
            ? `${d.data.element} (${d.data.weight})`
            : d.data.weight
        );
    });

    // for the remaining pool nodes, leaf nodes that are not merged
    const pool = svgGroup
      .selectAll(".node-pool")
      .data(poolNodes)
      .enter()
      .append("g")
      .attr("class", "node-pool")
      .attr("transform", (d, i) => `translate(${i * 35},${height - 80})`); // reduced spacing between nodes

    pool.append("circle").attr("r", 10).attr("fill", "lightblue");

    pool
      .append("text")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .style("font-size", "10px") // reduced font size
      .text((d) => `${d.element} (${d.weight})`);

    // Highlight the nodes being merged in the current step
    if (currentStep % 2 === 1) {
      const mergeNodes = steps[currentStep].slice(-2);
      svgGroup
        .selectAll(".node-pool")
        .filter((d) => mergeNodes.some((n) => n.id === d.id))
        .select("circle")
        .attr("fill", "orange");
    }
  }, [steps, currentStep]);

  // Next Step button handler
  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  return (
    <div className="my-5 lg:my-10 flex-col text-center">
      <h3 className="text-base font-semibold lg:text-2xl text-white">
        Visualization
      </h3>
      <div className="relative flex justify-center">
        <svg
          id="huffmanTree"
          className="my-5 border-[1px] border-white rounded-xl w-[70%] h-[80%] lg:w-[60%] lg:h-3/4"
        ></svg>
        <p className="text-white absolute text-xs top-6 lg:text-sm">
          Step: {currentStep + 1} / {steps.length}
        </p>
        <p className="text-white absolute invisible lg:right-[22%] lg:top-7 lg:text-sm lg:visible">
          Scroll to zoom | Drag to pan
        </p>
        <button
          onClick={handleNextStep}
          disabled={currentStep >= steps.length - 1}
          className="text-xs px-1 lg:p-1 text-white rounded-md bottom-8 right-[17%] drop-shadow-custom-purple ring-1 ring-purple-600 hover:bg-purple-200 hover:text-black absolute md:text-sm lg:bottom-10 lg:right-[22%] disabled:opacity-25"
        >
          Next Step
        </button>
      </div>
    </div>
  );
};

export default HuffmanTreeAnimation;

HuffmanTreeAnimation.propTypes = {
  data: PropTypes.array.isRequired,
};
