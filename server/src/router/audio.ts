import { Router } from "express";
import { isVerified, mustAuth } from "#/middleware/auth";
import fileParser from "#/middleware/fileParser";
import { validate } from "#/middleware/validator";
import { AudioValidationSchema } from "#/utils/validationSchema";
import { createAudio } from "#/controllers/audio";



const router = Router();

router.post('/create', [mustAuth, isVerified, fileParser, validate(AudioValidationSchema)], createAudio);



export default router;