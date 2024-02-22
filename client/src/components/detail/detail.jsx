import axios from 'axios';
import { getDrivers } from '../../redux/actions';
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styles from "../detail/stylesdetail.module.css";
import { useDispatch } from 'react-redux';

const defaultImage = "https://1000marcas.net/wp-content/uploads/2020/01/logo-F1.png";

const Detail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [driver, setDriver] = useState({});

  useEffect(() => {
    let dataReset = {};
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/drivers/${id}`);
        const data = response.data;

        if (Object.keys(data).length === 0) {
          setDriver(null);
        } else {
          if (data.createInDb) {
            dataReset = {
              ...data,
              image: data.image,
            };
          } else {
            dataReset = {
              ...data,
              image: data.image.url,
            };
          }
          setDriver(dataReset);
        }
      } catch (error) {
        return "Error"
      }
    };

    fetchData();
  }, [id]);



  const formatTeams = (teams) => {
    if (typeof teams === 'string') {
      return teams;
    } else if (Array.isArray(teams)) {
      return teams.map((team) => team.name).join(', ');
    } else {
      return '';
    }
  };

  const deleteHandler = async () => {
    try {
      const response = await axios.delete(`http://localhost:3001/drivers/${id}`);
      if (response.status === 200) {
        await dispatch(getDrivers());
        alert('El conductor ha sido eliminado');
        navigate.push('/home');
      }
    } catch (error) {
     return "error"
    }
  };

  return (
    <div className={styles.detailContainer}>
      
<h2 >
    <Link to='/home' className={styles.volverButton} title='Volver'>
      Back ⬅️
      </Link>

</h2>
      

      {driver && Object.keys(driver).length !== 0 ? (
        <>
          <h4 className={styles.id}>{`${driver.id}`}</h4>
          {driver.name ? (
            <h3 className={styles.nombre}>{`${driver.name.forename} ${driver.name.surname}`}</h3>
             ) : (
                <h3>{`${driver.forename} ${driver.surname}`}</h3>
              )}
          <h5 className={styles.nacionalidad}>{`${driver.nationality}`}</h5>
          <img src={driver.image || defaultImage} alt='Driver' className={styles.imagen} />

          {driver.description ? (
              <h5 className={styles.descripcion}>{`${driver.description}`}</h5>
            ) : (
              <h5 className={styles.descripcion}>{`este conductor no tiene descripcion`}</h5>
            )}

          <h4>{`${driver.dob}`}</h4>

            {driver.teams ? (
              <h5 className={styles.teams}>{formatTeams(driver.teams)}</h5>
            ) : (
              driver.Teams && <h5 className='teams'>{formatTeams(driver.Teams)}</h5>
            )}
          </>
        ) : (
          <p>Loading Driver...</p>
        )}
    </div>
  );
};

export default Detail;