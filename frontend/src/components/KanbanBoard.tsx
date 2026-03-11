'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Draggable, Droppable, type DropResult, type DragStart } from '@hello-pangea/dnd';
import type { AppDispatch, RootState } from '../store/store';
import { moveOrder, type Order, type OrderStatus, setError } from '../store/ordersSlice';
import { updateOrderStatus } from '../services/ordersApi';
import { OrderCard } from './OrderCard';

const STATUSES: OrderStatus[] = ['NEW', 'PREPARING', 'READY'];

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  NEW: ['PREPARING'],
  PREPARING: ['READY'],
  READY: []
};

export function KanbanBoard() {
  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector((state: RootState) => state.orders.orders);
  const [activeDragStatus, setActiveDragStatus] = useState<OrderStatus | null>(null);

  const handleDragStart = (start: DragStart) => {
    setActiveDragStatus(start.source.droppableId as OrderStatus);
  };

  const handleDragEnd = async (result: DropResult) => {
    setActiveDragStatus(null);
    const { destination, source, draggableId } = result;
    if (!destination) return;

    const fromStatus = source.droppableId as OrderStatus;
    const toStatus = destination.droppableId as OrderStatus;

    if (fromStatus === toStatus) return;
    if (!VALID_TRANSITIONS[fromStatus]?.includes(toStatus)) return;

    dispatch(moveOrder({ id: draggableId, status: toStatus }));

    try {
      await updateOrderStatus(draggableId, toStatus);
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to move order'));
    }
  };

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid gap-6 md:grid-cols-3">
        {STATUSES.map((status) => {
          const filtered = orders.filter((order: Order) => order.status === status);
          const isDropDisabled = activeDragStatus 
            ? activeDragStatus !== status && !VALID_TRANSITIONS[activeDragStatus]?.includes(status)
            : false;

          return (
            <section key={status} className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm">
              <header className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-widest text-slate-600">{status}</h2>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                  {filtered.length}
                </span>
              </header>
              <Droppable droppableId={status} isDropDisabled={isDropDisabled}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`h-[60vh] space-y-3 overflow-y-auto transition-colors ${
                      snapshot.isDraggingOver ? 'bg-slate-50/50' : ''
                    }`}
                  >
                    {filtered.map((order, index) => (
                      <Draggable
                        key={order.id}
                        draggableId={String(order.id)}
                        index={index}
                        isDragDisabled={status === 'READY'}
                      >
                        {(dragProvided, dragSnapshot) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            className={`${
                              status === 'READY'
                                ? 'cursor-not-allowed opacity-80'
                                : 'cursor-grab active:cursor-grabbing'
                            } ${dragSnapshot.isDragging ? 'z-50' : ''}`}
                          >
                            <OrderCard order={order} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </section>
          );
        })}
      </div>
    </DragDropContext>
  );
}
