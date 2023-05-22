import React, { useCallback, useState ,useEffect} from 'react'
import 'quill/dist/quill.snow.css'
import Quill from 'quill'
import io from 'socket.io-client'
import { useParams } from 'react-router-dom'

const TOOLLBAR_OPTIONS= [
    [{header: [1,2,3,4,5,6,false]}],
    [{font: []}],
    [{list: "ordered"},{list: "bullet"}],
    ["bold","italic","underline"],
    [{color:[]},{background: []}],
    [{script: "sub"},{script: "super"}],
    [{align: []}],
    ["image","blockquote","code-block"],
    ["clean"]
]



export default function TextEditor() {  

  const  [socket,setSocket]=useState()
  const  [quill,setQuill]=useState()
  const {id: documentId}=useParams()
  const wrapperRef=useCallback((wrapper)=>{
     if(wrapper==null) return
     wrapper.innerHTML=""
     const editor=document.createElement('div')
     wrapper.append(editor)
     const q=new Quill(editor,{theme:'snow',modules: {toolbar: TOOLLBAR_OPTIONS}})
     q.disable()
     q.setText("Loading...")
     setQuill(q)
     console.log(documentId)
   },[])
   
  useEffect(()=>{
     const s=io("http://localhost:5000")
     setSocket(s)
     
     return()=>{
        s.disconnect()
      }
   },[])
   
   useEffect(()=>{
      
      if(socket==null || quill == null) return
      const handleChange =(delta,oldDelta,source)=>{
         if(source!=='user') return;
         
        socket.emit("send-text-changes",delta)
     }

     quill.on("text-change",handleChange)

     return ()=>{
        quill.off("text-change",handleChange)
     }
  },[socket,quill])

  useEffect(()=>{

    if(socket==null || quill == null) return
     const handleChange =(delta)=>{
        quill.updateContents(delta)
     }

     socket.on("receive-text-changes",handleChange)

     return ()=>{
        socket.off("receive-text-changes",handleChange)
     }
  },[socket,quill])

  useEffect(()=>{
     if(socket==null || quill==null) return

     socket.once("load-data",async document=>{
        quill.setContents(document)
        quill.enable()
     })

     socket.emit("get-data",documentId)
  },[socket,quill,documentId])

   useEffect(()=>{
       if(socket==null || quill==null) return;

       const timer=setInterval(()=>{
          socket.emit("save-doc",quill.getContents())
       },2000)

       return ()=>{
         clearInterval(timer)
       }

   },[socket,quill])


  return (
    <div className='container' ref={wrapperRef}>
      
    </div>
  )
}
