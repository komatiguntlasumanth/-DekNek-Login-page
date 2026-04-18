package com.deknek.studentmgmt.controller;

import com.deknek.studentmgmt.model.Student;
import com.deknek.studentmgmt.model.User;
import com.deknek.studentmgmt.repository.StudentRepository;
import com.deknek.studentmgmt.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Student> getAllStudents(Principal principal) {
        return studentRepository.findByUserEmail(principal.getName());
    }

    @PostMapping
    public Student createStudent(@RequestBody Student student, Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).get();
        student.setUser(user);
        return studentRepository.save(student);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        return studentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable Long id, @RequestBody Student studentDetails, Principal principal) {
        return studentRepository.findById(id)
                .filter(student -> student.getUser().getEmail().equals(principal.getName()))
                .map(student -> {
                    student.setFirstName(studentDetails.getFirstName());
                    student.setLastName(studentDetails.getLastName());
                    student.setEmail(studentDetails.getEmail());
                    student.setCourse(studentDetails.getCourse());
                    student.setGrade(studentDetails.getGrade());
                    student.setStatus(studentDetails.getStatus());
                    return ResponseEntity.ok(studentRepository.save(student));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id, Principal principal) {
        return studentRepository.findById(id)
                .filter(student -> student.getUser().getEmail().equals(principal.getName()))
                .map(student -> {
                    studentRepository.delete(student);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
