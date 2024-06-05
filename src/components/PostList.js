// Importing necessary libraries and components
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AppBar, Box, Container, IconButton, InputBase, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Toolbar, Typography, Hidden } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { CircularProgress } from '@mui/material';

// Defining the PostList component
const PostList = () => {
  // Initializing state variables
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetching posts when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        setPosts(response.data); // Setting the posts state
        setLoading(false); // Setting loading to false after data is fetched
      } catch (error) {
        setError(error.message); // Setting error if there is an error while fetching data
        setLoading(false); // Setting loading to false after data is fetched
      }
    };

    fetchPosts();
  }, []);

  // Handler for page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handler for rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handler for search input change
  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  // Filtering posts based on search input
  const filteredPosts = posts.filter(post => post.title.includes(search));

  // Showing loading spinner while data is being fetched
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Showing error message if there is an error while fetching data
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Rendering the posts list
  return (
    <Container>
      <AppBar position="static" sx={{ backgroundColor: 'grey.700', borderRadius: 2 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Posts
          </Typography>
          <Box sx={{ position: 'relative', ml: 2 }}>
            <IconButton sx={{ p: '10px' }} aria-label="search">
              <SearchIcon sx={{ color: 'grey.300' }} />
            </IconButton>
            <InputBase
              sx={{ color: 'inherit', pl: '14px' }}
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              value={search}
              onChange={handleSearch}
            />
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ my: 2 }}>
        <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead sx={{ bgcolor: 'grey.500' }}>
              <TableRow>
                <TableCell sx={{ color: 'white' }}>ID</TableCell>
                <TableCell sx={{ color: 'white' }}>Title</TableCell>
                {/* <Hidden smDown> */}
                <TableCell sx={{ color: 'white' }}>Content</TableCell>
                {/* </Hidden> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? filteredPosts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : filteredPosts
              ).map((post) => (
                <TableRow key={post.id}>
                  <TableCell>{post.id}</TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{post.title}</TableCell>
                  <Hidden smDown>
                    <TableCell sx={{ textTransform: 'capitalize' }}>{post.body}</TableCell>
                  </Hidden>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredPosts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>
    </Container>
  );
};

export default PostList;