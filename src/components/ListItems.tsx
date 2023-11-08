
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// const ListItems = ({listTasks}:any) => {
//   return (
//     <ul>{listTasks.map((task) => (
//         <li key={task.id}>
//             {editTask && editTask.id === task.id ? (
//                 <div>
//                     <input
//                         type="text"
//                         value={editTask.title}
//                         onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
//                     />
//                     <button
//                         onClick={() => {
//                             UpdateTask.mutate(editTask);
//                             setEditTask(null);
//                         }}
//                     >
//                         Save
//                     </button>
//                 </div>
//             ) : (
//                 <div>
//                     <input
//                         type="checkbox"
//                         checked={task.completed}
//                         onChange={() => toggleTask.mutate(task)}
//                     />
//                     {task.title}
//                     <button
//                         onClick={() => {
//                             setEditTask(task);
//                         }}
//                     >
//                         Update
//                     </button>
//                     <button onClick={() => deleteTask.mutate(task.id)}>Delete</button>
//                 </div>
//             )}
//         </li>
//     ))}</ul>
//   )
// }

// export default ListItems