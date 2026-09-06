import { useState } from "react";
import {
  Plus,
  CheckSquare,
  Maximize2,
  MoreHorizontal,
  LayoutGrid,
  List as ListIcon,
  GripVertical,
  FileText,
  Calendar,
  Grid,
  User,
} from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { cn } from "../../lib/utils";
import { SmartTaskInput } from "../SmartTaskInput";

type Status = "To Do" | "In Progress" | "Done";

type Task = {
  id: string;
  title: string;
  status: Status;
  assignee: string;
  dueDate: string;
  urgent: boolean;
  important: boolean;
};

const DUMMY_TASKS: Task[] = [
  {
    id: "1",
    title: "Design Landing Page",
    status: "To Do",
    assignee: "Alice",
    dueDate: "Oct 24",
    urgent: true,
    important: true,
  },
  {
    id: "2",
    title: "Implement Auth",
    status: "In Progress",
    assignee: "Bob",
    dueDate: "Oct 25",
    urgent: false,
    important: true,
  },
  {
    id: "3",
    title: "Fix Navigation Bug",
    status: "Done",
    assignee: "Charlie",
    dueDate: "Oct 20",
    urgent: true,
    important: false,
  },
  {
    id: "4",
    title: "Write Documentation",
    status: "To Do",
    assignee: "Alice",
    dueDate: "Oct 28",
    urgent: false,
    important: false,
  },
  {
    id: "5",
    title: "User Testing",
    status: "In Progress",
    assignee: "David",
    dueDate: "Oct 30",
    urgent: true,
    important: true,
  },
];

const COLUMNS: { id: Status; label: string; color: string }[] = [
  { id: "To Do", label: "To Do", color: "bg-slate-200" },
  { id: "In Progress", label: "In Progress", color: "bg-blue-200" },
  { id: "Done", label: "Done", color: "bg-green-200" },
];

export function TasksView({ initialViewMode = "table" }: { initialViewMode?: "table" | "board" | "matrix" | "calendar" } = {}) {
  const [tasks, setTasks] = useState<Task[]>(DUMMY_TASKS);
  const [viewMode, setViewMode] = useState<"table" | "board" | "matrix" | "calendar">(initialViewMode);
  const [calendarFilter, setCalendarFilter] = useState<"grid" | "today" | "thisWeek" | "thisMonth" | "laterThisMonth" | "nextYear" | "unscheduled">("grid");

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const newTasks = Array.from(tasks);
    const draggedTaskIndex = newTasks.findIndex((t) => t.id === draggableId);
    if (draggedTaskIndex === -1) return;

    const draggedTask = newTasks[draggedTaskIndex];

    // Remove the task
    newTasks.splice(draggedTaskIndex, 1);

    // Update status
    draggedTask.status = destination.droppableId as Status;

    // Insert at new position
    const tasksInDestColumn = newTasks.filter(
      (t) => t.status === destination.droppableId,
    );

    if (destination.index >= tasksInDestColumn.length) {
      // Append to the end of the list
      newTasks.push(draggedTask);
    } else {
      // Insert before the task that currently occupies the destination index
      const taskAtDest = tasksInDestColumn[destination.index];
      const insertIndex = newTasks.findIndex((t) => t.id === taskAtDest.id);
      newTasks.splice(insertIndex, 0, draggedTask);
    }

    setTasks(newTasks);
  };

  const getStatusBadge = (status: Status) => {
    switch (status) {
      case "To Do":
        return (
          <span className="px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 text-xs font-medium">
            To Do
          </span>
        );
      case "In Progress":
        return (
          <span className="px-2 py-0.5 rounded-sm bg-blue-100 text-blue-700 text-xs font-medium">
            In Progress
          </span>
        );
      case "Done":
        return (
          <span className="px-2 py-0.5 rounded-sm bg-green-100 text-green-700 text-xs font-medium">
            Done
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-notion-bg text-notion-text">
      {/* Header Tabs */}
      <div className="flex items-center gap-4 border-b border-notion-border px-8 pt-4 pb-0 mb-6">
        <div
          onClick={() => setViewMode("table")}
          className={cn(
            "flex items-center gap-2 pb-2 cursor-pointer border-b-2 transition-colors",
            viewMode === "table"
              ? "border-notion-text text-notion-text font-medium"
              : "border-transparent text-notion-text-dim hover:text-notion-text",
          )}
        >
          <ListIcon size={16} /> Table
        </div>
        <div
          onClick={() => setViewMode("board")}
          className={cn(
            "flex items-center gap-2 pb-2 cursor-pointer border-b-2 transition-colors",
            viewMode === "board"
              ? "border-notion-text text-notion-text font-medium"
              : "border-transparent text-notion-text-dim hover:text-notion-text",
          )}
        >
          <LayoutGrid size={16} /> Board
        </div>
        <div
          onClick={() => setViewMode("matrix")}
          className={cn(
            "flex items-center gap-2 pb-2 cursor-pointer border-b-2 transition-colors",
            viewMode === "matrix"
              ? "border-notion-text text-notion-text font-medium"
              : "border-transparent text-notion-text-dim hover:text-notion-text",
          )}
        >
          <Grid size={16} /> Eisenhower Matrix
        </div>
        <div
          onClick={() => setViewMode("calendar")}
          className={cn(
            "flex items-center gap-2 pb-2 cursor-pointer border-b-2 transition-colors",
            viewMode === "calendar"
              ? "border-notion-text text-notion-text font-medium"
              : "border-transparent text-notion-text-dim hover:text-notion-text",
          )}
        >
          <Calendar size={16} /> Calendar
        </div>

        <div className="ml-auto pb-2">
          <button className="text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-sm flex items-center transition-colors">
            <Plus size={16} className="mr-1" /> New
          </button>
        </div>
      </div>

      {/* Content Area with smooth transition */}
      <div className="flex-1 px-8 pt-2 overflow-y-auto pb-20 animate-in fade-in duration-300">
        <SmartTaskInput
          onAdd={(task) => {
            const newTask: Task = {
              id: Date.now().toString(),
              title: task.title || "Untitled Task",
              status: "To Do",
              assignee: "Unassigned",
              dueDate: task.date || "No Date",
              urgent: false,
              important: false,
            };
            setTasks((prev) => [newTask, ...prev]);
          }}
        />

        {viewMode === "table" && (
          <div className="w-full">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="text-notion-text-dim border-b border-notion-border">
                  <th className="py-2 px-3 font-normal w-1/2 flex items-center gap-2">
                    <FileText size={14} /> Name
                  </th>
                  <th className="py-2 px-3 font-normal">
                    <CheckSquare size={14} className="inline mr-2" /> Status
                  </th>
                  <th className="py-2 px-3 font-normal">
                    <User size={14} className="inline mr-2" /> Assignee
                  </th>
                  <th className="py-2 px-3 font-normal">
                    <Calendar size={14} className="inline mr-2" /> Due Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-notion-border border-b border-notion-border">
                {tasks.map((task) => (
                  <tr
                    key={task.id}
                    className="group hover:bg-notion-bg-hover transition-colors"
                  >
                    <td className="py-2 px-3 relative flex items-center">
                      <span className="font-medium">{task.title}</span>
                      {/* Hover action "Open as page" */}
                      <button className="absolute right-2 opacity-0 group-hover:opacity-100 flex items-center gap-1 bg-white border border-notion-border shadow-sm px-2 py-0.5 rounded-sm text-xs text-notion-text-dim hover:bg-slate-50 transition-all font-medium">
                        <Maximize2 size={12} /> OPEN
                      </button>
                    </td>
                    <td className="py-2 px-3">{getStatusBadge(task.status)}</td>
                    <td className="py-2 px-3 text-notion-text-dim">
                      {task.assignee}
                    </td>
                    <td className="py-2 px-3 text-notion-text-dim">
                      {task.dueDate}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td
                    colSpan={4}
                    className="py-2 px-3 text-notion-text-dim hover:bg-notion-bg-hover cursor-pointer transition-colors flex items-center gap-2"
                  >
                    <Plus size={14} /> New
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {viewMode === "board" && (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-4 items-start h-full overflow-x-auto pb-4 w-full">
              {COLUMNS.map((col) => {
                const columnTasks = tasks.filter((t) => t.status === col.id);
                return (
                  <div key={col.id} className="flex flex-col w-72 shrink-0">
                    <div className="flex items-center gap-2 mb-3 px-1 text-sm font-medium text-notion-text-dim">
                      <span className={cn("w-2 h-2 rounded-full", col.color)} />
                      {col.label}
                      <span className="text-xs bg-slate-100 px-1.5 rounded-sm">
                        {columnTasks.length}
                      </span>
                      <Plus
                        size={14}
                        className="ml-auto cursor-pointer hover:text-notion-text transition-colors"
                      />
                    </div>

                    <Droppable droppableId={col.id}>
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={cn(
                            "flex flex-col gap-2 min-h-[150px] p-1 rounded-md transition-colors",
                            snapshot.isDraggingOver
                              ? "bg-slate-50"
                              : "bg-transparent",
                          )}
                        >
                          {columnTasks.map((task, index) => (
                            <Draggable
                              key={task.id}
                              draggableId={task.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={cn(
                                    "bg-white border border-notion-border rounded-md p-3 shadow-sm group cursor-pointer hover:bg-slate-50 transition-all",
                                    snapshot.isDragging
                                      ? "shadow-md ring-1 ring-blue-200 opacity-95 rotate-1 z-10"
                                      : "",
                                  )}
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium text-sm text-notion-text leading-tight">
                                      {task.title}
                                    </h4>
                                    <button className="opacity-0 group-hover:opacity-100 text-notion-text-dim hover:text-notion-text transition-opacity ml-2">
                                      <MoreHorizontal size={14} />
                                    </button>
                                  </div>
                                  <div className="flex flex-wrap gap-2 mt-3">
                                    {getStatusBadge(task.status)}
                                    {task.assignee && (
                                      <span className="flex items-center gap-1 text-xs text-notion-text-dim border border-notion-border px-1.5 py-0.5 rounded-sm bg-slate-50">
                                        <User size={10} /> {task.assignee}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        )}

        {viewMode === "matrix" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full pb-4 min-h-[500px]">
            {/* Q1: Urgent & Important */}
            <div className="bg-white border border-notion-border rounded-lg p-4 shadow-sm flex flex-col min-h-[200px]">
              <h3 className="font-bold text-red-600 mb-3 flex items-center text-sm"><span className="w-2.5 h-2.5 rounded-full bg-red-500 mr-2"></span>Do First (Urgent & Important)</h3>
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {tasks.filter(t => t.urgent && t.important).map(task => (
                  <div key={task.id} className="border border-notion-border rounded p-2 text-sm hover:bg-slate-50 transition-colors flex justify-between items-center group">
                    <span className="font-medium text-slate-700">{task.title}</span>
                    {getStatusBadge(task.status)}
                  </div>
                ))}
                {tasks.filter(t => t.urgent && t.important).length === 0 && (
                  <div className="text-slate-400 text-sm italic py-2">No tasks</div>
                )}
              </div>
            </div>
            
            {/* Q2: Not Urgent & Important */}
            <div className="bg-white border border-notion-border rounded-lg p-4 shadow-sm flex flex-col min-h-[200px]">
              <h3 className="font-bold text-blue-600 mb-3 flex items-center text-sm"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-2"></span>Schedule (Not Urgent & Important)</h3>
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {tasks.filter(t => !t.urgent && t.important).map(task => (
                  <div key={task.id} className="border border-notion-border rounded p-2 text-sm hover:bg-slate-50 transition-colors flex justify-between items-center group">
                    <span className="font-medium text-slate-700">{task.title}</span>
                    {getStatusBadge(task.status)}
                  </div>
                ))}
                {tasks.filter(t => !t.urgent && t.important).length === 0 && (
                  <div className="text-slate-400 text-sm italic py-2">No tasks</div>
                )}
              </div>
            </div>

            {/* Q3: Urgent & Not Important */}
            <div className="bg-white border border-notion-border rounded-lg p-4 shadow-sm flex flex-col min-h-[200px]">
              <h3 className="font-bold text-orange-500 mb-3 flex items-center text-sm"><span className="w-2.5 h-2.5 rounded-full bg-orange-500 mr-2"></span>Delegate (Urgent & Not Important)</h3>
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {tasks.filter(t => t.urgent && !t.important).map(task => (
                  <div key={task.id} className="border border-notion-border rounded p-2 text-sm hover:bg-slate-50 transition-colors flex justify-between items-center group">
                    <span className="font-medium text-slate-700">{task.title}</span>
                    {getStatusBadge(task.status)}
                  </div>
                ))}
                {tasks.filter(t => t.urgent && !t.important).length === 0 && (
                  <div className="text-slate-400 text-sm italic py-2">No tasks</div>
                )}
              </div>
            </div>

            {/* Q4: Not Urgent & Not Important */}
            <div className="bg-white border border-notion-border rounded-lg p-4 shadow-sm flex flex-col min-h-[200px]">
              <h3 className="font-bold text-slate-500 mb-3 flex items-center text-sm"><span className="w-2.5 h-2.5 rounded-full bg-gray-400 mr-2"></span>Don't Do (Not Urgent & Not Important)</h3>
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {tasks.filter(t => !t.urgent && !t.important).map(task => (
                  <div key={task.id} className="border border-notion-border rounded p-2 text-sm hover:bg-slate-50 transition-colors flex justify-between items-center group">
                    <span className="font-medium text-slate-700">{task.title}</span>
                    {getStatusBadge(task.status)}
                  </div>
                ))}
                {tasks.filter(t => !t.urgent && !t.important).length === 0 && (
                  <div className="text-slate-400 text-sm italic py-2">No tasks</div>
                )}
              </div>
            </div>
          </div>
        )}

        {viewMode === "calendar" && (
          <div className="bg-white border border-notion-border rounded-lg shadow-sm flex flex-col h-full min-h-[500px] overflow-hidden">
            <div className="p-4 border-b border-notion-border flex flex-col gap-4 bg-slate-50/50">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-lg">October 2026</h3>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 border border-notion-border rounded-md bg-white hover:bg-slate-50 text-sm font-medium transition-colors">Today</button>
                  <div className="flex border border-notion-border rounded-md overflow-hidden bg-white">
                    <button className="px-3 py-1.5 hover:bg-slate-50 transition-colors border-r border-notion-border">&lt;</button>
                    <button className="px-3 py-1.5 hover:bg-slate-50 transition-colors">&gt;</button>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setCalendarFilter('grid')}
                  className={cn("px-3 py-1.5 border border-notion-border rounded-md text-sm font-medium transition-colors", calendarFilter === 'grid' ? "bg-slate-800 text-white border-slate-800 shadow-sm" : "bg-white hover:bg-slate-50 text-slate-600")}
                >Grid</button>
                <button 
                  onClick={() => setCalendarFilter('today')}
                  className={cn("px-3 py-1.5 border border-notion-border rounded-md text-sm font-medium transition-colors", calendarFilter === 'today' ? "bg-slate-800 text-white border-slate-800 shadow-sm" : "bg-white hover:bg-slate-50 text-slate-600")}
                >Today</button>
                <button 
                  onClick={() => setCalendarFilter('thisWeek')}
                  className={cn("px-3 py-1.5 border border-notion-border rounded-md text-sm font-medium transition-colors", calendarFilter === 'thisWeek' ? "bg-slate-800 text-white border-slate-800 shadow-sm" : "bg-white hover:bg-slate-50 text-slate-600")}
                >This Week</button>
                <button 
                  onClick={() => setCalendarFilter('thisMonth')}
                  className={cn("px-3 py-1.5 border border-notion-border rounded-md text-sm font-medium transition-colors", calendarFilter === 'thisMonth' ? "bg-slate-800 text-white border-slate-800 shadow-sm" : "bg-white hover:bg-slate-50 text-slate-600")}
                >This Month</button>
                <button 
                  onClick={() => setCalendarFilter('laterThisMonth')}
                  className={cn("px-3 py-1.5 border border-notion-border rounded-md text-sm font-medium transition-colors", calendarFilter === 'laterThisMonth' ? "bg-slate-800 text-white border-slate-800 shadow-sm" : "bg-white hover:bg-slate-50 text-slate-600")}
                >Later This Month</button>
                <button 
                  onClick={() => setCalendarFilter('nextYear')}
                  className={cn("px-3 py-1.5 border border-notion-border rounded-md text-sm font-medium transition-colors", calendarFilter === 'nextYear' ? "bg-slate-800 text-white border-slate-800 shadow-sm" : "bg-white hover:bg-slate-50 text-slate-600")}
                >Next Year</button>
                <button 
                  onClick={() => setCalendarFilter('unscheduled')}
                  className={cn("px-3 py-1.5 border border-notion-border rounded-md text-sm font-medium transition-colors", calendarFilter === 'unscheduled' ? "bg-slate-800 text-white border-slate-800 shadow-sm" : "bg-white hover:bg-slate-50 text-slate-600")}
                >Unscheduled</button>
              </div>
            </div>
            
            {calendarFilter === 'grid' && (
              <div className="flex-1 grid grid-cols-7 grid-rows-[auto_1fr_1fr_1fr_1fr_1fr]">
                {/* Days of week */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-xs font-semibold text-slate-500 border-b border-notion-border bg-white">{day}</div>
                ))}
                
                {/* Calendar Grid (dummy 5 weeks for Oct 2026 starting Thu Oct 1) */}
                {Array.from({ length: 35 }).map((_, i) => {
                  const dayOffset = i - 3; // Oct 1 is Thursday (index 4)
                  const isCurrentMonth = dayOffset >= 1 && dayOffset <= 31;
                  const dateNum = isCurrentMonth ? dayOffset : (dayOffset < 1 ? 30 + dayOffset : dayOffset - 31);
                  
                  // Find tasks for this day (dummy matching)
                  const dayTasks = isCurrentMonth ? tasks.filter(t => t.dueDate === `Oct ${dateNum}`) : [];
                  
                  return (
                    <div key={i} className={cn("border-b border-r border-notion-border p-1.5 min-h-[100px] flex flex-col", !isCurrentMonth && "bg-slate-50/50 opacity-50")}>
                      <div className="text-right text-xs text-slate-500 font-medium p-1">{dateNum}</div>
                      <div className="flex-1 flex flex-col gap-1 overflow-y-auto pr-1">
                        {dayTasks.map(task => (
                          <div key={task.id} className="text-[10px] p-1 rounded bg-blue-50 text-blue-700 border border-blue-100 truncate cursor-pointer hover:bg-blue-100 transition-colors" title={task.title}>
                            {task.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {calendarFilter !== 'grid' && (
              <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-white">
                {tasks.map(task => (
                   <div key={task.id} className="border border-notion-border rounded p-3 text-sm hover:bg-slate-50 transition-colors flex justify-between items-center group">
                     <div>
                       <span className="font-medium text-slate-700">{task.title}</span>
                       <span className="text-slate-500 ml-2 text-xs">Due: {task.dueDate || 'Unscheduled'}</span>
                     </div>
                     {getStatusBadge(task.status)}
                   </div>
                ))}
                {tasks.length === 0 && (
                   <div className="text-slate-400 text-sm text-center py-8">No tasks in this category.</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
