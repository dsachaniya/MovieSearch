import Image from "next/image";
import Error from "next/error";
import { fetchMovieDetails } from "../../apis/getMovieDetails";

export default function MovieDetails({ data, errorCode, message }) {
  if (errorCode) {
    return <Error statusCode={errorCode} message={message} />;
  }

  if(!data){
     return <div></div>;
  }
  const { backdrop_path, title, tagline, overview, release_date, status ,vote_average, vote_count} = data
  
  return (
    <div>
      <div>
        <Image
          src={`https://image.tmdb.org/t/p/original${backdrop_path}?api_key=4cb1eeab94f45affe2536f2c684a5c9e`}
          alt={title}
          width="300"
          height="300"
        />
        <div>
          <h1>{title}</h1>
          <h3>{tagline}</h3>
          <p>{overview}</p>
          <p>{release_date}</p>
          <p>{status}</p>
          <p>Vote Average: {vote_average}</p>
          <p>Vote Count : {vote_count}</p>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const slug = context.params?.slug;

  let details;

  try {
    const data = await fetchMovieDetails(slug);
    details = data;
  } catch (err) {
    console.log(err);
    context.response.status = 500;
    return {
      props: {
        errorCode: 500,
        message: "Something went wrong",
      },
    };
  }

  return {
    props: {
      data: details,
    },
  };
}
