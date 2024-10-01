import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function App() {
  const [entries, setEntries] = useState([]);
  const [currentEntryIndex, setCurrentEntryIndex] = useState(0);
  const [caloricLimit, setCaloricLimit] = useState(2000);

  const lastSevenEntries = useMemo(() => {
    return entries.slice(-7);
  }, [entries]);

  const totalDeficit = useMemo(() => {
    return lastSevenEntries.reduce((acc, entry) => acc + Math.max(0, caloricLimit - entry.calories), 0);
  }, [lastSevenEntries, caloricLimit]);

  const totalSurplus = useMemo(() => {
    return lastSevenEntries.reduce((acc, entry) => acc + Math.max(0, entry.calories - caloricLimit), 0);
  }, [lastSevenEntries, caloricLimit]);

  const handleCaloricChange = (e) => {
    const updatedEntries = [...entries];
    updatedEntries[currentEntryIndex] = { ...updatedEntries[currentEntryIndex], calories: parseInt(e.target.value, 10) || 0 };
    setEntries(updatedEntries);
  };

  const addNewEntry = () => {
    const newEntry = { calories: 0 };
    setEntries([...entries, newEntry]);
    setCurrentEntryIndex(entries.length);
  };

  const navigateEntries = (direction) => {
    const newIndex = currentEntryIndex + direction;
    if (newIndex >= 0 && newIndex < entries.length) {
      setCurrentEntryIndex(newIndex);
    }
  };

  const applyChanges = () => {
    // Here you might want to save changes or notify user of update
  };

  const deficitSurplusCount = useMemo(() => {
    let deficit = 0, surplus = 0;
    entries.forEach(entry => {
      if (entry.calories < caloricLimit) deficit++;
      else if (entry.calories > caloricLimit) surplus++;
    });
    return { deficit, surplus };
  }, [entries, caloricLimit]);

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Caloric Intake Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <Button onClick={() => navigateEntries(-1)} disabled={currentEntryIndex === 0}>Previous</Button>
            <Button onClick={() => navigateEntries(1)} disabled={currentEntryIndex === entries.length - 1}>Next</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entry</TableHead>
                <TableHead>Calories</TableHead>
                <TableHead>Deficit/Surplus</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lastSevenEntries.map((entry, idx) => (
                <TableRow key={idx}>
                  <TableCell>{entries.length - 6 + idx}</TableCell>
                  <TableCell>{entry.calories} kcal</TableCell>
                  <TableCell>
                    {entry.calories < caloricLimit ? (
                      <span className="text-green-500">-{caloricLimit - entry.calories}</span>
                    ) : (
                      <span className="text-red-500">+{entry.calories - caloricLimit}</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell><strong>Total</strong></TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <strong>
                    Deficit: <span className="text-green-500">-{totalDeficit}</span> / 
                    Surplus: <span className="text-red-500">+{totalSurplus}</span>
                  </strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="mt-6">
            <Input 
              type="number" 
              value={entries[currentEntryIndex]?.calories || 0} 
              onChange={handleCaloricChange} 
              placeholder="Enter calories" 
              label="Current Entry Calories (kcal)"
            />
            <div className="flex mt-2">
              <Button onClick={applyChanges}>Apply</Button>
              <Button onClick={addNewEntry} className="ml-2">New Entry</Button>
            </div>
            <Input 
              type="number" 
              value={caloricLimit} 
              onChange={(e) => setCaloricLimit(parseInt(e.target.value, 10) || 0)} 
              placeholder="Set your caloric limit" 
              label="Caloric Limit (kcal)"
              className="mt-4"
            />
            <p className="mt-4">
              <strong>Deficit Entries:</strong> {deficitSurplusCount.deficit} | 
              <strong>Surplus Entries:</strong> {deficitSurplusCount.surplus}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;