import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { RiCheckboxBlankCircleLine } from "react-icons/ri";
import { RiCheckboxCircleFill } from "react-icons/ri";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Todo() {
  const [todos, setTodos] = useState([]);

  const [task, setTask] = useState();
  useEffect(() => {
    axios
      .get("http://localhost:3001/get")
      .then((result) => setTodos(result.data))
      .catch((err) => console.log(err));
  }, []);
  const handleClick = () => {
  
    axios
      .post("http://localhost:3001/add", { task: task })
      .then((result) =>{
        toast.success("Added new Data!");
        setTodos([...todos, result.data]);
      })
    

      .catch((err) => console.log(err));
  
    console.log(task);
  };
  const handleEdit = (id) => {
    // Find the task by ID in the current state
    const editedTask = todos.find(task => task._id === id);
    
    // Toggle the done property
    const updatedTask = { ...editedTask, done: !editedTask.done };
  
    // Update the task on the server
    axios.put("http://localhost:3001/update/" + id, updatedTask)
      .then((result) => {
        // If needed, update the state to reflect the change in task completion status
        const updatedTodos = todos.map(task => task._id === id ? updatedTask : task);
        setTodos(updatedTodos);
        if (updatedTask.done) {
          toast.success("Task marked as Completed!");
        } else {
          toast.warning("Task not Completed yet!");
        }      })
      .catch((err) => console.log(err));
  }
  
  const remove =(id)=>{
    axios.delete("http://localhost:3001/delete/"+id)
    .then((result) => {
      toast.error("Task Deleted!");
      setTodos(todos.filter((todo)=>todo._id!==id))
    })
    .catch((err) => console.log(err)); 
  }

  return (
    <div className="h-screen w-screen  bg-blue-900 flex justify-center">
    <div className="border border-white rounded  p-5   h-max mt-10 w-max ">
      <h2 className="flex justify-center mt-2 text-white text-4xl">Todo List</h2>
      <div className="flex justify-center gap-3 mt-10">
        <input
          type="text"
          onChange={(e) => setTask(e.target.value)}
          className="border border-blue-800 w-80 p-3 rounded"
        />
        <button
          type="button"
          onClick={handleClick}
          className=" border border-blue-600 bg-blue-700 rounded text-white p-3"
        >
          <ToastContainer/>
          Add
        </button>
      </div>
      <div className=" flex-col items-center mt-5  flex">
        {todos.length === 0 ? (
          <div>
            <h1 className="text-xl text-white">No Records</h1>
          </div>
        ) : (
          todos.map((item, index) => (
            <div
              key={index}
              className="w-96 m-1 p-3 border bg-orange-600  text-white rounded flex justify-evenly items-center"
            >
              
                <div onClick={()=>handleEdit(item._id)} className="flex cursor-pointer " >
                  {
                    item.done?<RiCheckboxCircleFill  />
                    :<RiCheckboxBlankCircleLine/>
                      

                  }
</div>
                <div className="flex w-64">
                <p className={item.done?"line-through text-xl  " :"text-xl"}> {item.task}</p></div>
                <div className=" text-2xl hover:cursor-pointer" onClick={()=>remove(item._id)}>
                  <MdDelete/>
                </div>
              </div>
            
          ))
        )}
      </div>

      </div>
    </div>
  );
}

export default Todo;
