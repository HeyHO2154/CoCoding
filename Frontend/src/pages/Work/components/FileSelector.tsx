const FileSelector = ({ node, level = 0 }: { node: FileNode; level?: number }) => {
  const isSelected = isFileSelected(node.path);

  return (
    <div style={{ marginLeft: `${level * 20}px` }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => handleFileSelect(node.path, e.target.checked)}
        />
        {node.isDirectory ? '📁' : '📄'} {node.name}
      </label>
      {node.children && (
        <div style={{ marginLeft: '20px' }}>
          {node.children.map(child => (
            <FileSelector key={child.path} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}; 