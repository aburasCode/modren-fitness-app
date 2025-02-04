import React, { useState, useEffect } from 'react';
import { Box, Stack, Button, TextField, Typography } from '@mui/material';
import HorizontalScrollbar from './HorizontalScrollbar';
import { fetchData, exerciseOptions } from '../utils/fetchData';

const SearchExercises = ({ setExercises, bodyPart, setBodyPart }) => {
  const [search, setSearch] = useState('');
  const [bodyParts, setBodyParts] = useState([]);

  useEffect(() => {
    const fetchExercisesData = async () => {
      try {
        const bodyPartsData = await fetchData('https://exercisedb.p.rapidapi.com/exercises/bodyPartList', exerciseOptions);

        if (!Array.isArray(bodyPartsData)) {
          throw new Error("Expected an array but received an invalid format");
        }

        setBodyParts(['all', ...bodyPartsData]);
      } catch (error) {
        console.error("Error fetching exercise data:", error);
        setBodyParts(['all']); // Ensure it's always an array
      }
    };

    fetchExercisesData();
  }, []);

  const handleSearch = async () => {
    if (search) {
      const exercisesData = await fetchData('https://exercisedb.p.rapidapi.com/exercises', exerciseOptions);

      const searchedExercises = exercisesData.filter(
        (item) => item.name.toLowerCase().includes(search)
               || item.target.toLowerCase().includes(search)
               || item.equipment.toLowerCase().includes(search)
               || item.bodyPart.toLowerCase().includes(search)
      );

      setSearch('');
      setExercises(searchedExercises);
    }
  };

  return (
    <Box>
      <Typography variant="h3" mb="46px">
        Awesome Exercises You <br /> Should Know
      </Typography>
      <Stack direction="row" spacing={2} mb="20px">
        <TextField
          sx={{ input: { fontWeight: '700', border: 'none', borderRadius: '4px' } }}
          height="76px"
          value={search}
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
          placeholder="Search Exercises"
          type="text"
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ bgcolor: '#FF2625', color: '#fff', textTransform: 'none', width: { lg: '175px', xs: '80px' }, height: '56px', fontSize: { lg: '20px', xs: '14px' } }}
          onClick={handleSearch}
        >
          Search
        </Button>
      </Stack>
      <Box sx={{ position: 'relative', width: '100%', p: '20px' }}>
        <HorizontalScrollbar data={bodyParts} bodyPart={bodyPart} setBodyPart={setBodyPart} />
      </Box>
    </Box>
  );
};

export default SearchExercises;