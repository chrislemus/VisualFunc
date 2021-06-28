import Head from 'next/head'
import Fibonacci from '../components/fibonacci'
import {useState} from 'react';

export default function Home() {
  const [result, setResult] = useState('')
  const array = [3,1,2,9,2]
  
  return (
    <div >
      <Head>
        <title>Visual Func</title>
        <meta name="description" content="Live algorithms and functions visualizer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main > 
        <h1>Hello</h1>
        result
        {/* <button onClick={() => setResult(quickSort(array))}>Run</button>
        <br/>
        <p>{result}</p> */}
        <Fibonacci/>
      </main>

    </div>
  )
}

function quickSort(array) {
  // Write your code here.
	quickSortHelper(array, 0, array.length - 1)
	return array
}

function quickSortHelper(array, startIdx, endIdx) {
  //=========
  console.log(array, startIdx, endIdx)
  //=========start
  console.log(startIdx >= endIdx, `if(${startIdx} >= ${endIdx}) return`)
  //---- run
	if(startIdx >= endIdx) return;
  //========= end
  //=========start
  console.log(`const pivotIdx = startIdx # ${startIdx}`)
  //---- run
	const pivotIdx = startIdx;
  //========= end
	let leftIdx = startIdx + 1;
	let rightIdx = endIdx;
	while(rightIdx >= leftIdx) {
		if(array[leftIdx] > array[pivotIdx] && array[rightIdx] < array[pivotIdx]) {
			swap(leftIdx, rightIdx, array);
		}
		if(array[leftIdx] <= array[pivotIdx]) leftIdx++;
		if(array[rightIdx] >= array[pivotIdx]) rightIdx--;
	}
	swap(pivotIdx, rightIdx, array);
	const leftSubarrayIsSmaller = rightIdx - 1 - startIdx < endIdx - (rightIdx + 1)
	if(leftSubarrayIsSmaller) {
		quickSortHelper(array, startIdx, rightIdx -1)
		quickSortHelper(array, rightIdx  + 1, endIdx)
	} else {
		quickSortHelper(array, rightIdx  + 1, endIdx)
		quickSortHelper(array, startIdx, rightIdx -1)
	}
}

function swap(i, j, array) {
	let temp = array[j];
	array[j] = array[i];
	array[i] = temp
}


// function quickSort(array) {
//   // Write your code here.
// 	quickSortHelper(array, 0, array.length - 1)
// 	return array
// }

// function quickSortHelper(array, startIdx, endIdx) {
//   //
//   console.log(array, startIdx, endIdx)
//   //
//   const
// 	if(startIdx >= endIdx) return;
// 	const pivotIdx = startIdx;
// 	let leftIdx = startIdx + 1;
// 	let rightIdx = endIdx;
// 	while(rightIdx >= leftIdx) {
// 		if(array[leftIdx] > array[pivotIdx] && array[rightIdx] < array[pivotIdx]) {
// 			swap(leftIdx, rightIdx, array);
// 		}
// 		if(array[leftIdx] <= array[pivotIdx]) leftIdx++;
// 		if(array[rightIdx] >= array[pivotIdx]) rightIdx--;
// 	}
// 	swap(pivotIdx, rightIdx, array);
// 	const leftSubarrayIsSmaller = rightIdx - 1 - startIdx < endIdx - (rightIdx + 1)
// 	if(leftSubarrayIsSmaller) {
// 		quickSortHelper(array, startIdx, rightIdx -1)
// 		quickSortHelper(array, rightIdx  + 1, endIdx)
// 	} else {
// 		quickSortHelper(array, rightIdx  + 1, endIdx)
// 		quickSortHelper(array, startIdx, rightIdx -1)
// 	}
// }

// function swap(i, j, array) {
// 	let temp = array[j];
// 	array[j] = array[i];
// 	array[i] = temp
// }


