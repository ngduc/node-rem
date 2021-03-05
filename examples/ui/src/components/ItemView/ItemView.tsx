import React from 'react';

export default ({ item, onBackClick }: { item: any; onBackClick: () => void }) => (
  <div className="p-5">
    <div>Selected Item: {JSON.stringify(item)}</div>

    <button onClick={onBackClick}>Go Back</button>
  </div>
);
