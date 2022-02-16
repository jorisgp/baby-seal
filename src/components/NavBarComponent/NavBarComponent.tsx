import React, { FC } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import styles from "./NavBarComponent.module.scss";

type NavBarComponentProps = {};

const NavBarComponent: FC<NavBarComponentProps> = (props) => {
  return (
    <Navbar
      className={styles.NavBarComponent}
      bg="light"
      expand="lg"
      data-testid="NavBarComponent"
    >
      <Container>
        <Navbar.Brand href="/">Joris & Tyrone</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link to="vlog">Vlog</Link>
            <Link to="blog">Blog</Link>
            <Link to="contact">Contact</Link>
            <Link to="donate">Help ons</Link>
            <Link to="admin">Admin</Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBarComponent;
