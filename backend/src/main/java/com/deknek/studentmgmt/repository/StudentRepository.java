package com.deknek.studentmgmt.repository;

import com.deknek.studentmgmt.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findByUserEmail(String email);
}
