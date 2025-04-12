import React, { useRef, useState, useEffect } from 'react';

type DraggableWrapperProps = {
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
};

function DraggableWrapper({
  children,
  initialPosition = { x: 300, y: 120 },
  initialSize = { width: 600, height: 600 },
}: DraggableWrapperProps) {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);

  const dragging = useRef(false);
  const resizing = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width: 0, height: 0 });

  const isInteractiveElement = (el: HTMLElement) => {
    const tag = el.tagName;
    return (
      el.isContentEditable ||
      ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A', 'LABEL'].includes(tag)
    );
  };

  const onMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    // Avoid drag if clicking on an input or the resize handle
    if (isInteractiveElement(target) || target.dataset?.resizeHandle === 'true') {
      return;
    }

    dragging.current = true;
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (dragging.current) {
      setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
    }

    if (resizing.current) {
      const dx = e.clientX - resizeStart.current.x;
      const dy = e.clientY - resizeStart.current.y;

      setSize({
        width: Math.max(100, startSize.current.width + dx),
        height: Math.max(100, startSize.current.height + dy),
      });
    }
  };

  const onMouseUp = () => {
    dragging.current = false;
    resizing.current = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  const onResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent drag from starting
    resizing.current = true;
    resizeStart.current = { x: e.clientX, y: e.clientY };
    startSize.current = { ...size };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <div
      onMouseDown={onMouseDown}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        cursor: dragging.current ? 'grabbing' : 'grab',
        zIndex: 9999,
        boxSizing: 'border-box',
        backgroundColor: '#fff',
        boxShadow: '0 0 5px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        border: '1px solid #888',
        borderRadius: '15px',
      }}
    >
      {children}

      {/* Resize handle */}
      <div
        onMouseDown={onResizeMouseDown}
        data-resize-handle="true"
        style={{
          position: 'absolute',
          width: 16,
          height: 16,
          right: 0,
          bottom: 0,
          cursor: 'se-resize',
          backgroundColor: '#ccc',
          zIndex: 10000,
        }}
      />
    </div>
  );
}

export default DraggableWrapper;
