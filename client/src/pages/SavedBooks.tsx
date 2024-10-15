import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useQuery, useMutation} from '@apollo/client';

// import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth';
// import { removeBookId } from '../utils/localStorage';
import { Navigate, useParams } from 'react-router-dom';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import { DELETE_BOOK } from '../utils/mutations';

const SavedBooks = () => {

  const {username: userParam } = useParams();
  console.log("UseParams:",useParams());

  //Grab the user data from the query_user or the query_me query using the username
  const {loading, data} = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: {username: userParam},
  });

  console.log("Data:",data);

  //mutation used to delete added books
  const [deleteBook, {error}] = useMutation(DELETE_BOOK)
  
  const user = data?.me || data?.user || {};
  console.log("User:",user)

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId: string) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const {data: bookData} = await deleteBook({
        variables: {$bookId: {bookId}},
      })

      console.log('Book:', bookData, "has been successfully Deleted")
    } catch (err) {
      console.error(err);
    }
  };

  if(Auth.loggedIn() && Auth.getProfile().data.username === userParam){
    return <Navigate to='/savedMe'/>
  }

    if(loading){
      return <div>Loading...</div>
    }

    if(!user?.username){
      return (
        <h4>
          You need to be logged in to see this page. Use the navigation links to sign up or log in.
        </h4>
      )
    }

  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          {user.username ? (
            <h1>Viewing {user.username}'s saved books!</h1>
          ) : (
            <h1>Viewing saved books!</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {user.savedBooks.length
            ? `Viewing ${user.savedBooks.length} saved ${
                user.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {user.savedBooks.map((book: any) => {
            return (
              <Col md='4'>
                <Card key={book.bookId} border='dark'>
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant='top'
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    {error && (
                      <div>
                        {error.message}
                      </div>
                    )}
                    <Button
                      className='btn-block btn-danger'
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
