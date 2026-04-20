package com.deknek.studentmgmt.repository;

import com.deknek.studentmgmt.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {
    @Query("SELECT s FROM Student s WHERE LOWER(s.user.email) = LOWER(:identifier) OR LOWER(s.user.username) = LOWER(:identifier)")
    List<Student> findByUserIdentifier(@Param("identifier") String identifier);
}
